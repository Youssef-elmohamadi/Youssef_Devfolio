// app/about/page.tsx
import { generateSEO } from "@/utils/seo"; // تأكد من المسار الصحيح
import AboutClient from "./AboutClientPage";

const aboutPageUrl = "https://the-forge-one.vercel.app/about";
const aboutPageTitle =
  "About Youssef Elmohamadi | Frontend Developer | The Forge";
const aboutPageDescription =
  "Learn more about Youssef Elmohamadi, a Frontend Developer and Computer Science student. View my skills, experience, and academic background.";
const aboutPageImage = "https://the-forge-one.vercel.app/youssef.png";

export const metadata = generateSEO({
  title: aboutPageTitle,
  description: aboutPageDescription,
  url: aboutPageUrl,
  image: aboutPageImage,
  type: "article",
  keywords: [
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

export default function AboutPage() {
  return <AboutClient />;
}
