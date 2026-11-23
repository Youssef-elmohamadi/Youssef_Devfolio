import type { Metadata } from "next";
import { generateSEO } from "@/utils/seo";
import { getAboutData } from "@/lib/api/aboutPage";
import { getTranslations } from "next-intl/server";
import AboutClient from "./AboutClientPage";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const aboutPageTitle = isAr
    ? "نبذة عن يوسف المحمدي | مطور واجهات أمامية ومهندس برمجيات | The Forge"
    : "About Youssef Elmohamadi | Frontend Developer | The Forge";
  const aboutPageDescription = isAr
    ? "تعرّف على يوسف المحمدي، مطور واجهات أمامية وطالب علوم حاسب. اطلع على مهاراتي، خبراتي العملية، ومسيرتي التعليمية في بناء تطبيقات الويب الحديثة."
    : "Learn more about Youssef Elmohamadi, a Frontend Developer and Computer Science student. View my skills, experience, and academic background.";
  const aboutPageImage = "https://the-forge-one.vercel.app/youssef.png";

  return generateSEO({
    title: aboutPageTitle,
    description: aboutPageDescription,
    image: aboutPageImage,
    type: "profile",
    locale,
    asPath: "/about",
    keywords: isAr
      ? [
          "يوسف المحمدي",
          "مطور واجهات أمامية",
          "React",
          "Next.js",
          "بورتفوليو",
          "مهارات",
          "خبرات",
          "نبذة عني",
        ]
      : [
          "Youssef Elmohamadi",
          "frontend developer",
          "React",
          "Next.js",
          "portfolio",
          "skills",
          "experience",
          "about",
        ],
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations("about");
  let aboutData = null;

  try {
    const response = await getAboutData(locale);
    if (response && response.data) {
      aboutData = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch about data:", error);
  }

  // Handle case where data might be missing (e.g., API error)
  if (!aboutData) {
    return (
      <div className="container max-w-7xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          {t("failedLoad")}
        </h2>
        <p className="text-gray-500">{t("tryAgain")}</p>
      </div>
    );
  }

  return <AboutClient data={aboutData} />;
}
