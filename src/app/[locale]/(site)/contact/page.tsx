import React from "react";
import type { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";
import { generateSEO } from "@/utils/seo";

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const contactPageTitle = isAr
    ? "تواصل معي | يوسف المحمدي | The Forge"
    : "Contact | Youssef Elmohamadi | Frontend Developer | The Forge";
  const contactPageDescription = isAr
    ? "تواصل مع يوسف المحمدي لبحث فرص التعاون، المشاريع البرمجية، أو الاستشارات التقنية. لنبني شيئاً رائعاً معاً!"
    : "Get in touch with Youssef Elmohamadi for collaborations, projects, or inquiries. Let's build something great together!";
  const contactPageImage = "https://the-forge-one.vercel.app/youssef.png";

  return generateSEO({
    title: contactPageTitle,
    description: contactPageDescription,
    image: contactPageImage,
    type: "website",
    locale,
    asPath: "/contact",
    keywords: isAr
      ? [
          "يوسف المحمدي",
          "تواصل معي",
          "مطور واجهات أمامية",
          "React",
          "Next.js",
          "تعاون برمجي",
          "فريلانس",
          "بورتفوليو",
        ]
      : [
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
}

export default function Contact() {
  return <ContactClientPage />;
}
