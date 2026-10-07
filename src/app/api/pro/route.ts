import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured, localStore, ProApplicationRecord } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, phone, email, trade, experience_years, city, s3_document_key } = body;

    if (!full_name || !phone || !trade) {
      return NextResponse.json(
        { success: false, error: "Name, phone, and trade are required" },
        { status: 400 }
      );
    }

    const appId = `PRO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: ProApplicationRecord = {
      id: appId,
      full_name,
      phone,
      email: email || "",
      trade,
      experience_years: Number(experience_years) || 1,
      city: city || "Bengaluru",
      s3_document_key: s3_document_key || "",
      status: "submitted",
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("pro_applications").insert([newRecord]).select().single();
      if (!error && data) {
        return NextResponse.json({ success: true, source: "supabase", application: data });
      }
      console.warn("Supabase insert pro fallback:", error);
    }

    const saved = localStore.saveProApplication(newRecord);
    return NextResponse.json({ success: true, source: "local_store", application: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
