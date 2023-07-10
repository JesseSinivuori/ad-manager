import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  if (
    process.env.NODE_ENV === "development" &&
    ["POST", "PUT"].includes(req.method)
  ) {
    const body = await req.json();
    console.log("body:", body);
  }
}
