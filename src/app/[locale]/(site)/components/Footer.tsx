import Image from "next/image";
import { Link } from '@/i18n/routing';
import { getTranslations } from "next-intl/server";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaTiktok,
  FaSnapchat,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaPinterest,
  FaDiscord,
  FaStackOverflow,
  FaLink,
} from "react-icons/fa";
import { getHomeData, type SocialLink } from "@/lib/api/home";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  behance: FaBehance,
  dribbble: FaDribbble,
  medium: FaMedium,
  pinterest: FaPinterest,
  discord: FaDiscord,
  stackoverflow: FaStackOverflow,
};

function getPlatformIcon(platform: string): React.ElementType {
  return PLATFORM_ICONS[platform?.toLowerCase()] ?? FaLink;
}

export default async function Footer() {
  const t = await getTranslations("footer");
  let socialLinks: SocialLink[] = [];
  try {
    const homeData = await getHomeData();
    socialLinks = homeData?.SocialLink ?? [];
  } catch (error) {
    console.error("Failed to load footer social links:", error);
  }

  // Fallback to defaults if no social links are fetched
  const displayLinks = socialLinks.length > 0 ? socialLinks : [
    { id: 1, platform: "github", url: "https://github.com/Youssef-elmohamadi", platform_name: "Github" },
    { id: 2, platform: "twitter", url: "https://twitter.com/elmohamadidev", platform_name: "Twitter" },
    { id: 3, platform: "linkedin", url: "https://linkedin.com/in/el-mohamadi", platform_name: "LinkedIn" }
  ];

  return (
    <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-800 relative z-10">
      <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 pb-16 sm:py-3 sm:pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-start">
            <Link
              href="/"
              aria-label={t("brandAria")}
              className="inline-flex items-center font-bold text-primary"
            >
              <Image
                src="/logo/light-logo.webp"
                width={100}
                height={28}
                alt="The Forge Logo"
                className="h-6 w-auto block dark:hidden"
              />
              <Image
                src="/logo/dark-logo.webp"
                width={100}
                height={28}
                alt="The Forge Logo"
                className="h-6 w-auto hidden dark:block"
              />
            </Link>
            <span className="hidden sm:inline-block text-gray-300 dark:text-gray-700">|</span>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
              {t("rights", { year: new Date().getFullYear() })}
            </p>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            {displayLinks.map((link) => {
              const IconComponent = getPlatformIcon(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform_name || link.platform}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
