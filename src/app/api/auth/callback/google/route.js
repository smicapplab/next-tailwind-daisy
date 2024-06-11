import axios from "axios";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { access_token } = await req.json();
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const token = jwt.sign(
      {
        firstName: userInfo.data.given_name,
        lastName: userInfo.data.family_name,
        email: userInfo.data.email,
        app: "Internal",
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "5h",
      }
    );
    const res = await axios.post(
      `${process.env.AUTH_URL}/do-login`,
      {
        token: token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = NextResponse.json({
      success: true,
      data: res.data,
    });

    response.cookies.set("jwt", res.data.token, {
      httpOnly: true,
      maxAge: 28800, // for testing only
      domain: process.env.NODE_ENV === "production" ? ".koredor.ph" : "",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
