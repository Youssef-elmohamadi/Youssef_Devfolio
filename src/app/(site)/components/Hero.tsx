"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, scaleIn } from "@/utils/animations";
import DeveloperGrid from "./hero/DeveloperGrid";
import MouseSpotlight from "./hero/MouseSpotlight";
import FloatingCodeElements from "./hero/FloatingCodeElements";
import AnimatedTerminal from "./hero/AnimatedTerminal";
import RoleSwitcher from "./hero/RoleSwitcher";
import type { Profile, SocialLink } from "@/lib/api/home";

// Map platform name to a react-icons icon component dynamically to avoid
// importing every icon statically and to support any platform from the API.
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaDev,
  FaLink,
} from "react-icons/fa";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebook,
  dev: FaDev,
};

function getPlatformIcon(platform: string): React.ElementType {
  return PLATFORM_ICONS[platform?.toLowerCase()] ?? FaLink;
}

type HeroProps = {
  profile?: Profile | null;
  socialLinks?: SocialLink[];
};

export default function Hero({ profile, socialLinks = [] }: HeroProps) {
  const name = profile?.name ?? "Youssef";
  const firstName = name.split(" ")[0];
  const description =
    profile?.description ??
    "Frontend Developer (React, Next.js) | Computer Science Student. Welcome to my digital forge, where ideas are crafted into reality.";
  const imageUrl = profile?.image_url ?? "/elmohammadi.jpg";

  // Fall back to hardcoded links when API returns nothing
  const displayLinks: SocialLink[] =
    socialLinks.length > 0
      ? socialLinks
      : [
          {
            id: 1,
            platform: "github",
            url: "https://github.com/Youssef-elmohamadi",
            platform_name: "Github",
          },
          {
            id: 2,
            platform: "linkedin",
            url: "https://linkedin.com/in/el-mohamadi",
            platform_name: "LinkedIn",
          },
          {
            id: 3,
            platform: "twitter",
            url: "https://twitter.com/elmohamadidev",
            platform_name: "Twitter",
          },
        ];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden min-h-[90vh] flex items-center bg-transparent">
      {/* Background Layers */}
      <MouseSpotlight />
      <FloatingCodeElements />

      <div className="container max-w-7xl mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bio & Info */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div
              className="flex justify-center lg:justify-start items-center mb-6"
              {...scaleIn}
              transition={{ delay: 0.2 }}
            >
              <Image
                src={imageUrl}
                alt={name}
                width={128}
                height={128}
                className="rounded-full w-28 h-28 md:w-32 md:h-32 object-cover ring-4 ring-primary/20 dark:ring-primary/40 shadow-xl"
                priority
              />
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white"
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              Hi, I&apos;m{" "}
              <motion.span
                className="text-primary"
                {...fadeIn}
                transition={{ delay: 0.8 }}
              >
                {firstName}
              </motion.span>
            </motion.h1>

            {/* Role Switcher */}
            <motion.div
              className="w-full flex justify-center lg:justify-start"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <RoleSwitcher />
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed text-center lg:text-left"
              {...fadeInUp}
              transition={{ delay: 0.5 }}
            >
              {description}
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex justify-center lg:justify-start space-x-6 mb-8"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
            >
              {displayLinks.map((link) => {
                const Icon = getPlatformIcon(link.platform);
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform_name}
                    className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start"
              {...fadeInUp}
              transition={{ delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/projects"
                  className="bg-primary text-center inline-block w-full sm:w-auto text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 dark:shadow-primary/10"
                >
                  View Projects
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {profile?.cv_url ? (
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center w-full sm:w-auto border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Download CV
                  </a>
                ) : (
                  <Link
                    href="/youssef-cv"
                    className="inline-block text-center w-full sm:w-auto border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Hire Me
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Terminal Visual */}
          <div className="lg:col-span-5 w-full flex justify-center items-center mt-8 lg:mt-0">
            <AnimatedTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
