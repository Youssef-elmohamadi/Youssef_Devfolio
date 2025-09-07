// pages/api/newsletter.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  try {
    const API_KEY = process.env.MAILCHIMP_API_KEY as string;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID as string;
    const DATACENTER = API_KEY.split("-")[1]; // ex: us2

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      }
    );

    if (response.status >= 400) {
      return res
        .status(400)
        .json({ message: "There was an error subscribing. Try again later." });
    }

    return res.status(201).json({ message: "Thanks for subscribing!" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
