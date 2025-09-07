import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const API_KEY = process.env.MAILCHIMP_API_KEY as string;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID as string;
    const DATACENTER = API_KEY.split("-")[1]; // ex: us2

    // MD5 hash of lowercase email
    const subscriberHash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriberHash}`,
      {
        method: "PUT",
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: "subscribed", // لو جديد يضاف
          status: "subscribed", // لو قديم يتأكد إنه لسه مشترك
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Mailchimp error:", data);
      return NextResponse.json(
        { message: data.detail || "Error from Mailchimp" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "You have been successfully subscribed!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
