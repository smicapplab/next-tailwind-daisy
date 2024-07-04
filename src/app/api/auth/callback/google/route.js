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

    if (userInfo && userInfo.data) {
      const { sub, name, given_name, family_name, picture, email } =
        userInfo.data;

      const data = {
        id: sub,
        name: name || "",
        firstName: given_name || "",
        lastName: family_name || "",
        picture,
        email,
      };

      const token = jwt.sign(data, process.env.JWT_TOKEN_SECRET, {
        expiresIn: "5h",
      });

      const response = NextResponse.json({
        success: true,
        data,
      });

      response.cookies.set("jwt", token, {
        httpOnly: true,
        maxAge: 28800, // for testing only
        domain: process.env.NODE_ENV === "production" ? ".koredor.ph" : "",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return response;
    }

    NextResponse.json({
      success: false,
      message: "Ooooooops! Unknown error has occurred.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
