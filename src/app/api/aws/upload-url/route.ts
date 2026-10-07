import { NextResponse } from "next/server";
import { createPresignedUploadUrl, isAwsConfigured } from "@/lib/aws";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, contentType, folder } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    const { uploadUrl, fileKey, simulated } = await createPresignedUploadUrl(
      filename,
      contentType,
      folder || "bookings"
    );

    return NextResponse.json({
      success: true,
      uploadUrl,
      fileKey,
      isAwsConfigured,
      simulated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
