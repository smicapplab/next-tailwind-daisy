import { decodeToken } from "@/helpers/sessionHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let user = decodeToken(request);
    if (Object.keys(user).length > 0) {
      return NextResponse.json({ ...user, success: true });
    }
    
    return NextResponse.json({
      success: false,
      message: "Session object is empty!",
      decoded: user,
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, error: e });
  }
}