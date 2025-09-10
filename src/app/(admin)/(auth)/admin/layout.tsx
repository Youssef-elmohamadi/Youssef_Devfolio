import { ThemeContextProvider } from "@/app/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import "../../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-4 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        className={`relative flex items-center
         w-full  dark:bg-gray-900 sm:p-0`}
      >
        <div className="flex flex-col justify-center items-center gap-5 w-full h-full lg:w-1/2 p-4 sm:p-0">
          <div className="lg:hidden flex flex-col justify-center lg:flex-row lg:items-center mt-8">
            <Link href="/" className="flex justify-center mb-4">
              <img
                className="h-[76px] w-[200px] mb-3 drop-shadow-lg"
                src={`/logo/dark-logo.webp`}
                alt="The Forge logo"
              />
            </Link>
            {/* <p className="text-center text-gray-400 dark:text-white/60">
              {description[userType as keyof typeof description] ??
                description.end_user}
            </p> */}
          </div>
          {children}
        </div>

        <div className="hidden w-full h-screen lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid sticky top-0">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link href={"/"} className="block mb-4">
                <img
                  className="h-[76px] w-[200px] mb-3 drop-shadow-lg"
                  src={`/logo/dark-logo.webp`}
                  alt="The Forge logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Welcome to the admin panel. Please sign in to continue.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
      {/* {userType !== "end_user" && (
        <div
          className={`fixed z-50 bottom-6 sm:block ${
            isRTL ? "left-6" : "right-6"
          }`}
        >
          
        </div>
      )} */}
    </div>
  );
}
