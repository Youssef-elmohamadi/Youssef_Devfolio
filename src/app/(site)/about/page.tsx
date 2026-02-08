import { generateSEO } from "@/utils/seo";
import { getAboutData } from "@/lib/api/aboutPage"; // Ensure this path is correct
import AboutClient from "./AboutClientPage";

const aboutPageTitle =
  "About Youssef Elmohamadi | Frontend Developer | The Forge";
const aboutPageDescription =
  "Learn more about Youssef Elmohamadi, a Frontend Developer and Computer Science student. View my skills, experience, and academic background.";
const aboutPageImage = "https://the-forge-one.vercel.app/youssef.png";

export const metadata = generateSEO({
  title: aboutPageTitle,
  description: aboutPageDescription,
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

export default async function AboutPage() {
  let aboutData = null;

  try {
    const response = await getAboutData();
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
          Failed to load profile data.
        </h2>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return <AboutClient data={aboutData} />;
}
