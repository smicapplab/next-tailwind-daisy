import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set("jwt", "", {
      httpOnly: true,
      maxAge: 0,
      domain: process.env.NODE_ENV === "production" ? ".investree.ph" : "",
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}