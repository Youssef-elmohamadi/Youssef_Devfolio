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

  // Hide floating action buttons (BuyMeACoffee & TOC) while this helper is visible
  useEffect(() => {
    if (typeof window === "undefined") return;
    const floatingBtns = document.querySelectorAll(".buy-me-coffee-btn, .blog-toc-btn");
    floatingBtns.forEach((el) => {
      const btn = el as HTMLElement;
      if (isVisible) {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
        btn.style.transform = "scale(0.5)";
      } else {
        btn.style.opacity = "";
        btn.style.pointerEvents = "";
        btn.style.transform = "";
      }
    });
    return () => {
      floatingBtns.forEach((el) => {
        const btn = el as HTMLElement;
        btn.style.opacity = "";
        btn.style.pointerEvents = "";
        btn.style.transform = "";
      });
    };
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
        data-article-helper={isVisible ? "visible" : "hidden"}
        aria-hidden={!isVisible}
        inert={!isVisible ? true : undefined}
        className={`fixed bottom-[72px] sm:bottom-6 z-50 transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] motion-reduce:transition-opacity motion-reduce:duration-300 ${
          isVisible ? "pointer-events-auto" : "pointer-events-none"
        } ${
          isRtl
            ? `right-1.5 sm:right-6 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[calc(100%+40px)] opacity-0"
              }`
            : `left-1.5 sm:left-6 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-[calc(100%+40px)] opacity-0"
              }`
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-3.5 max-w-[calc(100vw-12px)] sm:max-w-xl">
          {/* 3D Character - responsive size */}
          <div
            className={`relative shrink-0 w-16 sm:w-28 h-20 sm:h-32 drop-shadow-xl animate-character-peek motion-reduce:animate-none transition-transform duration-300 ${
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
          <div className="relative pointer-events-auto bg-white dark:bg-[#15171e] text-gray-900 dark:text-gray-100 rounded-2xl sm:rounded-[32px] p-3 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800/80 max-w-[calc(100vw-84px)] sm:max-w-[390px]">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              onMouseEnter={() => setMood("angry")}
              onMouseLeave={() => setMood("default")}
              className="cursor-pointer absolute top-2 end-2 sm:top-3.5 sm:end-3.5 p-1 sm:p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              title="Close"
              aria-label="Close"
            >
              <FaTimes className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Bubble Tail pointing toward character */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white dark:bg-[#15171e] border-b border-gray-100 dark:border-gray-800/80 transform rotate-45 ${
                isRtl
                  ? "-right-1.5 sm:-right-2 border-r border-t-0 border-l-0"
                  : "-left-1.5 sm:-left-2 border-l border-t-0 border-r-0"
              }`}
            />

            {/* Title */}
            <h3 className="text-sm sm:text-xl font-bold tracking-tight mb-0.5 sm:mb-1 pe-4 sm:pe-0 text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{t("title")}</span>
            </h3>

            {/* Subtitle with heart */}
            <p className="text-[11px] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 leading-tight sm:leading-relaxed flex items-center gap-1 flex-wrap">
              <span className="text-red-500 inline-block text-xs sm:text-sm">❤️</span>
              <span>{t("text")}</span>
            </p>

            {/* Buttons Row - Single neat line on mobile, wraps on desktop */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap sm:flex-wrap">
              {/* Buy Coffee Button */}
              <a
                href={coffeeHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCoffeeClick}
                onMouseEnter={() => setMood("cheerful")}
                onMouseLeave={() => setMood("default")}
                className="cursor-pointer inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm font-bold rounded-xl sm:rounded-2xl text-white bg-[#ff6a00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all shadow-md active:scale-95 select-none shrink-0"
              >
                <FaCoffee className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                <span className="whitespace-nowrap">{t("buyCoffee")}</span>
              </a>

              {/* Send Message Button */}
              <Link
                href={finalContactHref}
                onClick={handleMessageClick}
                onMouseEnter={() => setMood("cheerful")}
                onMouseLeave={() => setMood("default")}
                className="cursor-pointer inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all active:scale-95 select-none shrink-0"
              >
                <ChatBubbleBottomCenterTextIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                <span className="whitespace-nowrap">{t("sendMessage")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body:has([data-article-helper="visible"]) .buy-me-coffee-btn,
        body:has([data-article-helper="visible"]) .blog-toc-btn {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: scale(0.5) !important;
        }
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
