import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isAwsConfigured } from "@/lib/aws";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const awsBucket = process.env.AWS_S3_BUCKET || "workivo-media-storage";
  const awsRegion = process.env.AWS_REGION || "ap-south-1";

  return NextResponse.json({
    supabase: {
      connected: isSupabaseConfigured,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 18)}...` : "Not Configured (Using Local Store)",
      databaseType: "PostgreSQL",
    },
    aws: {
      connected: isAwsConfigured,
      region: awsRegion,
      bucket: awsBucket,
      services: ["S3 Media Storage", "Pre-signed Upload API"],
    },
    environment: process.env.NODE_ENV,
  });
}
