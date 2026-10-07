import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured, localStore, BookingRecord } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (id) {
        query = query.eq("id", id);
      }
      if (phone) {
        query = query.eq("customer_phone", phone);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Supabase error fetching bookings:", error);
        return NextResponse.json({ success: true, source: "fallback", bookings: localStore.getBookings() });
      }

      const normalized = (data || []).map((row: any) => ({
        id: row.id || row.booking_code || "WKV-0000",
        customer_name: row.customer_name || "Workivo Customer",
        customer_phone: row.customer_phone || "+91 98765 43210",
        customer_email: row.customer_email || "",
        service_id: row.service_id || "home-service",
        service_name: row.service_name || row.service_title || "Home Service",
        scheduled_date: row.scheduled_date || "Today",
        scheduled_time: row.scheduled_time || "Morning (09:00 AM - 12:00 PM)",
        address: row.address || row.address_line || "Customer Address",
        notes: row.notes || "",
        status: (row.status === "escrow_locked" ? "matched" : row.status) || "matched",
        price_estimate: row.price_estimate || (row.total_amount ? `₹${row.total_amount}` : "From ₹249"),
        s3_photo_key: row.s3_photo_key || "",
        pro_assigned_name: row.pro_assigned_name || row.worker_name || "Pawan Verma",
        pro_assigned_phone: row.pro_assigned_phone || "+91 99201 88342",
        pro_rating: row.pro_rating || 4.9,
        created_at: row.created_at || new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, source: "supabase", bookings: normalized });
    }

    // Local fallback
    let bookings = localStore.getBookings();
    if (id) {
      bookings = bookings.filter((b) => b.id.toLowerCase() === id.toLowerCase());
    }
    if (phone) {
      bookings = bookings.filter((b) => b.customer_phone.includes(phone));
    }
    return NextResponse.json({ success: true, source: "local_store", bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      service_id,
      service_name,
      scheduled_date,
      scheduled_time,
      address,
      notes,
      price_estimate,
      s3_photo_key,
    } = body;

    if (!customer_name || !customer_phone || !service_id || !address) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields (name, phone, service, address)" },
        { status: 400 }
      );
    }

    const bookingId = `WKV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BookingRecord = {
      id: bookingId,
      customer_name,
      customer_phone,
      customer_email: customer_email || "",
      service_id,
      service_name: service_name || "Home Service",
      scheduled_date: scheduled_date || new Date().toISOString().split("T")[0],
      scheduled_time: scheduled_time || "Morning (09:00 AM - 12:00 PM)",
      address,
      notes: notes || "",
      status: "matched",
      price_estimate: price_estimate || "From ₹249",
      s3_photo_key: s3_photo_key || "",
      pro_assigned_name: "Pawan Verma",
      pro_assigned_phone: "+91 99201 88342",
      pro_rating: 4.9,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      // First attempt full payload
      let { data, error } = await supabase.from("bookings").insert([newRecord]).select().single();
      
      // If error is due to missing columns in legacy schema, adapt to legacy columns
      if (error && (error.code === "PGRST204" || error.message?.includes("column"))) {
        const legacyPayload: Record<string, any> = {
          booking_code: bookingId,
          service_title: newRecord.service_name,
          worker_name: newRecord.pro_assigned_name,
          scheduled_date: newRecord.scheduled_date,
          scheduled_time: newRecord.scheduled_time,
          address_line: newRecord.address,
          notes: newRecord.notes,
          status: "escrow_locked",
          total_amount: parseInt(newRecord.price_estimate.replace(/[^0-9]/g, "") || "249", 10),
          payment_method: "upi",
        };
        const retry = await supabase.from("bookings").insert([legacyPayload]).select().single();
        if (!retry.error && retry.data) {
          data = {
            ...newRecord,
            id: retry.data.id || bookingId,
          };
          error = null;
        }
      }

      if (!error && data) {
        return NextResponse.json({ success: true, source: "supabase", booking: data });
      }
      console.warn("Supabase insert fallback:", error);
    }

    // Save in local storage fallback
    const saved = localStore.saveBooking(newRecord);
    return NextResponse.json({ success: true, source: "local_store", booking: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return NextResponse.json({ success: true, source: "supabase", booking: data });
      }
    }

    const updated = localStore.updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: "local_store", booking: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
