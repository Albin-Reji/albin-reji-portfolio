import { NextResponse } from "next/server";
import { verifyEmail } from "@/lib/emailVerifier";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { valid: false, error: "Email query parameter is required." },
      { status: 400 }
    );
  }

  const result = await verifyEmail(email);
  return NextResponse.json(result, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { valid: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const result = await verifyEmail(email);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
