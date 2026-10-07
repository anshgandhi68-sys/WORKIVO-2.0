import { createClient } from "@supabase/supabase-js";
import { ImageSourcePropType } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface MobileBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  notes?: string;
  status: "pending" | "matched" | "on_the_way" | "in_progress" | "completed" | "cancelled";
  priceEstimate: string;
  proAssignedName: string;
  proAssignedPhone: string;
  proRating: number;
  proTrade: string;
  proImage?: ImageSourcePropType;
  createdAt: string;
}

export interface WorkerJob {
  id: string;
  bookingId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  address: string;
  scheduledTime: string;
  payout: number;
  status: "incoming" | "accepted" | "in_progress" | "completed";
  createdAt: string;
}

export const INITIAL_BOOKINGS: MobileBooking[] = [
  {
    id: "WKV-8421",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    serviceId: "electrician",
    serviceName: "Electrician",
    scheduledDate: "Today",
    scheduledTime: "Morning (09:00 AM - 12:00 PM)",
    address: "Flat 402, Green Glen Heights, Bellandur, Bengaluru",
    notes: "Main bedroom MCB tripping repeatedly on load",
    status: "on_the_way",
    priceEstimate: "From ₹249",
    proAssignedName: "Rajesh Kumar",
    proAssignedPhone: "+91 98112 34567",
    proRating: 4.9,
    proTrade: "Certified Electrician",
    proImage: require("../../assets/images/electrician.jpg"),
    createdAt: new Date().toISOString(),
  },
  {
    id: "WKV-5192",
    customerName: "Ananya Sen",
    customerPhone: "+91 99201 54321",
    serviceId: "ac-service",
    serviceName: "AC Service",
    scheduledDate: "Tomorrow",
    scheduledTime: "Afternoon (12:00 PM - 04:00 PM)",
    address: "Tower 2, 804, Sobha Quartz, HSR Layout, Bengaluru",
    notes: "Foam jet deep service for master bedroom split AC",
    status: "matched",
    priceEstimate: "From ₹449",
    proAssignedName: "Pawan Verma",
    proAssignedPhone: "+91 99201 88342",
    proRating: 4.9,
    proTrade: "HVAC Specialist",
    proImage: require("../../assets/images/ac-service.jpg"),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const INITIAL_WORKER_JOBS: WorkerJob[] = [
  {
    id: "JOB-101",
    bookingId: "WKV-8421",
    serviceName: "Switchboard & MCB Repair",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    address: "Flat 402, Green Glen Heights, Bellandur",
    scheduledTime: "Today • 10:30 AM",
    payout: 420,
    status: "accepted",
    createdAt: new Date().toISOString(),
  },
  {
    id: "JOB-102",
    bookingId: "WKV-9903",
    serviceName: "Chandelier & Ceiling Fan Fitting",
    customerName: "Priya Nair",
    customerPhone: "+91 98450 12345",
    address: "Villa 14, Palm Meadows, Whitefield",
    scheduledTime: "Today • 03:00 PM",
    payout: 650,
    status: "incoming",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// --- Supabase Cloud Sync Operations ---

export async function fetchRemoteBookings(): Promise<MobileBooking[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_BOOKINGS;
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_BOOKINGS;
    }

    return data.map((row: any) => ({
      id: row.id || row.booking_code || "WKV-0000",
      customerName: row.customer_name || "Workivo Customer",
      customerPhone: row.customer_phone || "+91 98765 43210",
      serviceId: row.service_id || "home-service",
      serviceName: row.service_name || row.service_title || "Home Service",
      scheduledDate: row.scheduled_date || "Today",
      scheduledTime: row.scheduled_time || "Morning",
      address: row.address || row.address_line || "Customer Address",
      notes: row.notes || "",
      status: (row.status === "escrow_locked" ? "matched" : row.status) || "matched",
      priceEstimate: row.price_estimate || (row.total_amount ? `₹${row.total_amount}` : "From ₹249"),
      proAssignedName: row.pro_assigned_name || row.worker_name || "Pawan Verma",
      proAssignedPhone: row.pro_assigned_phone || "+91 99201 88342",
      proRating: row.pro_rating || 4.9,
      proTrade: "Certified Pro",
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn("Error fetching remote bookings:", err);
    return INITIAL_BOOKINGS;
  }
}

export async function saveRemoteBooking(booking: MobileBooking): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const payload: Record<string, any> = {
      booking_code: booking.id,
      service_title: booking.serviceName,
      worker_name: booking.proAssignedName,
      scheduled_date: new Date().toISOString().split("T")[0],
      scheduled_time: booking.scheduledTime,
      address_line: booking.address,
      notes: booking.notes,
      status: "escrow_locked",
      total_amount: parseInt(booking.priceEstimate.replace(/[^0-9]/g, "") || "249", 10),
      payment_method: "upi",
    };

    const { error } = await supabase.from("bookings").insert([payload]);
    if (error) {
      console.warn("Supabase insert warning:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase save error:", err);
    return false;
  }
}

export async function updateRemoteBookingStatus(id: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .or(`id.eq.${id},booking_code.eq.${id}`);

    return !error;
  } catch (err) {
    console.warn("Supabase update error:", err);
    return false;
  }
}

