import Image from "next/image";
import { Link } from "@/i18n/routing";
import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../../globals.css";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.auth");

  return (
    <div className="relative min-h-screen bg-white z-1 dark:bg-gray-900">
      <div className="relative flex min-h-screen w-full dark:bg-gray-900">
        <div className="flex flex-col justify-center items-center gap-5 w-full min-h-screen lg:w-1/2 p-4 sm:p-6">
          <div className="lg:hidden flex flex-col justify-center lg:flex-row lg:items-center mt-4 sm:mt-8">
            <Link href="/" className="flex justify-center mb-4">
              <Image
                className="h-[60px] w-auto sm:h-[76px] mb-3 drop-shadow-lg"
                src={`/logo/dark-logo.webp`}
                alt="The Forge logo"
                width={180}
                height={68}
                priority
              />
            </Link>
          </div>
          {children}
        </div>

        <div className="hidden w-full min-h-screen lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid sticky top-0">
          <div className="relative flex items-center justify-center z-1 p-8">
            <GridShape />
            <div className="flex flex-col items-center max-w-sm text-center">
              <Link href={"/"} className="block mb-6">
                <Image
                  className="h-[76px] w-auto mb-3 drop-shadow-lg mx-auto"
                  src={`/logo/dark-logo.webp`}
                  alt="The Forge logo"
                  width={200}
                  height={76}
                  priority
                />
              </Link>
              <p className="text-center text-sm md:text-base leading-relaxed text-gray-400 dark:text-white/60">
                {t("welcomeSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Controls: Theme Toggler & Language Switcher */}
      <div className="fixed z-50 bottom-6 end-6 flex items-center gap-3">
        <div className="rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center">
          <LanguageSwitcher />
        </div>
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
