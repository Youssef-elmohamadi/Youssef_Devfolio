"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { FaCoffee, FaTimes } from "react-icons/fa";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export interface ArticleEndHelperProps {
  targetId?: string;
  contactHref?: string;
  coffeeHref?: string;
  characterSrc?: string;
}

const STORAGE_KEY = "articleHelperDismissed";

export default function ArticleEndHelper({
  targetId = "article-end",
  contactHref,
  coffeeHref = "https://www.buymeacoffee.com/elmohammadi",
  characterSrc = "/images/character.png",
}: ArticleEndHelperProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mood, setMood] = useState<"default" | "cheerful" | "angry">("default");
  const locale = useLocale();
  const t = useTranslations("articleHelper");
  const isRtl = locale === "ar";
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const finalContactHref = contactHref || "/contact";

  // Check sessionStorage after mounting
  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined") {
        const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
        if (dismissed === "true") {
          setIsDismissed(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted || isDismissed) return;

    let observer: IntersectionObserver | null = null;
    let hasScrolledSufficiently = false;

    const onScroll = () => {
      if (typeof window !== "undefined" && window.scrollY > 200) {
        hasScrolledSufficiently = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (typeof window !== "undefined" && window.scrollY > 200) {
      hasScrolledSufficiently = true;
    }

    const target = document.getElementById(targetId);
    if (target) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry?.isIntersecting &&
            (hasScrolledSufficiently ||
              (typeof window !== "undefined" && window.scrollY > 200))
          ) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setIsVisible(true);
            }, 600);

            observer?.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(target);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (observer) observer.disconnect();
    };
  }, [mounted, isDismissed, targetId]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {
      // ignore
    }
    // Allow slide-out animation to finish before removing from DOM
    setTimeout(() => {
      setIsDismissed(true);
    }, 750);
  };

  const handleCoffeeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleDismiss();
    window.open(coffeeHref, "_blank", "noopener,noreferrer");
  };

  const handleMessageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleDismiss();
    router.push(finalContactHref);
  };

  if (!mounted || isDismissed) {
    return null;
  }

  return (
    <>
      <div
        role="complementary"
        aria-live="polite"
        aria-hidden={!isVisible}
        inert={!isVisible ? true : undefined}
        className={`fixed bottom-4 sm:bottom-6 z-50 transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] motion-reduce:transition-opacity motion-reduce:duration-300 ${
          isVisible ? "pointer-events-auto" : "pointer-events-none"
        } ${
          isRtl
            ? `right-2 sm:right-6 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[calc(100%+40px)] opacity-0"
              }`
            : `left-2 sm:left-6 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-[calc(100%+40px)] opacity-0"
              }`
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3.5 max-w-[calc(100vw-24px)] sm:max-w-xl">
          {/* 3D Character - fully visible inside the screen */}
          <div
            className={`relative shrink-0 w-24 sm:w-28 h-28 sm:h-32 drop-shadow-xl animate-character-peek motion-reduce:animate-none transition-transform duration-300 ${
              isRtl ? "-scale-x-100" : ""
            } ${
              mood === "cheerful"
                ? "-translate-y-2 scale-105"
                : mood === "angry"
                ? "translate-y-1 scale-95"
                : ""
            }`}
          >
            {/* Default neutral smile */}
            <Image
              src="/images/character.png"
              alt=""
              width={140}
              height={160}
              className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-200 ${
                mood === "default" ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
            {/* Cheerful / Laughing */}
            <Image
              src="/images/Cheerful character.png"
              alt=""
              width={140}
              height={160}
              className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-200 ${
                mood === "cheerful" ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
            {/* Angry / Frowning */}
            <Image
              src="/images/Angry character.png"
              alt=""
              width={140}
              height={160}
              className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-200 ${
                mood === "angry" ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
          </div>

          {/* Speech Bubble Styled Exactly Like The Mockup */}
          <div className="relative pointer-events-auto bg-white dark:bg-[#15171e] text-gray-900 dark:text-gray-100 rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800/80 max-w-[calc(100vw-120px)] sm:max-w-[390px]">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              onMouseEnter={() => setMood("angry")}
              onMouseLeave={() => setMood("default")}
              className="cursor-pointer absolute top-3.5 end-3.5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              title="Close"
              aria-label="Close"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>

            {/* Bubble Tail pointing toward character */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#15171e] border-b border-gray-100 dark:border-gray-800/80 transform rotate-45 ${
                isRtl
                  ? "-right-2 border-r border-t-0 border-l-0"
                  : "-left-2 border-l border-t-0 border-r-0"
              }`}
            />

            {/* Title */}
            <h3 className="text-base sm:text-xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{t("title")}</span>
            </h3>

            {/* Subtitle with heart */}
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 leading-relaxed flex items-center gap-1.5 flex-wrap">
              <span className="text-red-500 inline-block text-sm">❤️</span>
              <span>{t("text")}</span>
            </p>

            {/* Buttons Row */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Buy Coffee Button (Orange Primary with Coffee Icon) */}
              <a
                href={coffeeHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCoffeeClick}
                onMouseEnter={() => setMood("cheerful")}
                onMouseLeave={() => setMood("default")}
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-2xl text-white bg-[#ff6a00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all shadow-md active:scale-95 select-none"
              >
                <FaCoffee className="w-4 h-4 text-white" />
                <span>{t("buyCoffee")}</span>
              </a>

              {/* Send Message Button (Secondary Outline with Chat Icon) */}
              <Link
                href={finalContactHref}
                onClick={handleMessageClick}
                onMouseEnter={() => setMood("cheerful")}
                onMouseLeave={() => setMood("default")}
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all active:scale-95 select-none"
              >
                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>{t("sendMessage")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes character-peek {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(1deg);
          }
        }
        .animate-character-peek {
          animation: character-peek 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
