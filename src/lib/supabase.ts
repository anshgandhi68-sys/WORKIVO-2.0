import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 10
);

// Real client when credentials exist
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BookingRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_id: string;
  service_name: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  notes?: string;
  status: "pending" | "matched" | "on_the_way" | "in_progress" | "completed" | "cancelled";
  price_estimate: string;
  s3_photo_key?: string;
  pro_assigned_name?: string;
  pro_assigned_phone?: string;
  pro_rating?: number;
  created_at: string;
}

export interface ProApplicationRecord {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  trade: string;
  experience_years: number;
  city: string;
  s3_document_key?: string;
  status: "submitted" | "under_review" | "approved";
  created_at: string;
}

// In-memory / persistent fallback storage for development & demo
class LocalDataStore {
  private bookingsKey = "workivo_mock_bookings";
  private prosKey = "workivo_mock_pros";

  private getInitialBookings(): BookingRecord[] {
    return [
      {
        id: "WKV-8421",
        customer_name: "Rahul Sharma",
        customer_phone: "+91 98765 43210",
        service_id: "electrician",
        service_name: "Electrician",
        scheduled_date: new Date().toISOString().split("T")[0],
        scheduled_time: "Morning (09:00 AM - 12:00 PM)",
        address: "Flat 402, Green Glen Heights, Bellandur, Bengaluru",
        notes: "Main bedroom MCB tripping repeatedly",
        status: "on_the_way",
        price_estimate: "From ₹249",
        pro_assigned_name: "Rajesh Kumar",
        pro_assigned_phone: "+91 98112 34567",
        pro_rating: 4.9,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }

  private inMemoryBookings: BookingRecord[] | null = null;
  private inMemoryPros: ProApplicationRecord[] | null = null;

  getBookings(): BookingRecord[] {
    if (typeof window === "undefined") {
      if (!this.inMemoryBookings) {
        this.inMemoryBookings = this.getInitialBookings();
      }
      return this.inMemoryBookings;
    }
    const data = localStorage.getItem(this.bookingsKey);
    if (!data) {
      const initial = this.getInitialBookings();
      localStorage.setItem(this.bookingsKey, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return this.getInitialBookings();
    }
  }

  saveBooking(booking: Omit<BookingRecord, "id" | "status" | "created_at">): BookingRecord {
    const bookings = this.getBookings();
    const newRecord: BookingRecord = {
      ...booking,
      id: `WKV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "matched",
      pro_assigned_name: "Pawan Verma",
      pro_assigned_phone: "+91 99201 88342",
      pro_rating: 4.9,
      created_at: new Date().toISOString(),
    };
    const updated = [newRecord, ...bookings];
    this.inMemoryBookings = updated;
    if (typeof window !== "undefined") {
      localStorage.setItem(this.bookingsKey, JSON.stringify(updated));
    }
    return newRecord;
  }

  updateBookingStatus(id: string, status: BookingRecord["status"]): BookingRecord | null {
    const bookings = this.getBookings();
    const target = bookings.find((b) => b.id.toLowerCase() === id.toLowerCase());
    if (!target) return null;
    target.status = status;
    this.inMemoryBookings = [...bookings];
    if (typeof window !== "undefined") {
      localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
    }
    return target;
  }

  saveProApplication(app: Omit<ProApplicationRecord, "id" | "status" | "created_at">): ProApplicationRecord {
    const newRecord: ProApplicationRecord = {
      ...app,
      id: `PRO-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "submitted",
      created_at: new Date().toISOString(),
    };
    if (!this.inMemoryPros) {
      this.inMemoryPros = [];
    }
    this.inMemoryPros = [newRecord, ...this.inMemoryPros];
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem(this.prosKey) || "[]");
      localStorage.setItem(this.prosKey, JSON.stringify([newRecord, ...existing]));
    }
    return newRecord;
  }
}

export const localStore = new LocalDataStore();
