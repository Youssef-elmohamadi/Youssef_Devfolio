import React from "react";
import ContactClientPage from "./ContactClientPage";
import { generateSEO } from "@/utils/seo"; // اتأكد من المسار الصحيح

const contactPageUrl = "https://youssef-devfolio.vercel.app/contact";
const contactPageTitle =
  "Contact | Youssef Elmohamadi | Frontend Developer | The Forge";
const contactPageDescription =
  "Get in touch with Youssef Elmohamadi for collaborations, projects, or inquiries. Let's build something great together!";
const contactPageImage =
  "https://youssef-devfolio.vercel.app/youssef.png"; // صورة OG/Twitter مخصصة

export const metadata = generateSEO({
  title: contactPageTitle,
  description: contactPageDescription,
  url: contactPageUrl,
  image: contactPageImage,
  type: "website", 
  keywords: [
    "Youssef Elmohamadi",
    "contact",
    "frontend developer",
    "React",
    "Next.js",
    "collaboration",
    "freelance",
    "portfolio",
  ],
});

const Contact = () => {
  return <ContactClientPage />;
};

export default Contact;
