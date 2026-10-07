import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  return NextResponse.json({
    success: true,
    message: "File stored in development mock storage (configure AWS S3 credentials in .env.local for production)",
    key,
  });
}

export async function POST(request: Request) {
  return PUT(request);
}
