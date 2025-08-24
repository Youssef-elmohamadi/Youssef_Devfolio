"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathName = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Projects", href: "/projects" },
  ];

  return (
    <div
      className="fixed z-50 w-full backdrop-blur-sm 
      bg-white/80 text-gray-900
      dark:bg-dark/80 dark:text-gray-100"
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt="Workflow"
                className="block h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex space-x-4 items-center">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathName === "/"
                    : pathName === item.href ||
                      pathName.startsWith(item.href + "/");

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`transition-all px-3 py-2 rounded-md text-sm font-medium hover:text-primary 
                        ${
                          isActive
                            ? "font-bold text-primary"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="cursor-pointer hover:text-primary
                  bg-gray-200 dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  p-2 rounded-full transition-colors"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden bg-gray-200 dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600
              transition-colors"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <ul className="flex flex-col space-y-4 py-3">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathName === "/"
                    : pathName === item.href ||
                      pathName.startsWith(item.href + "/");

                return (
                  <li key={item.name}>
                    <Link
                      onClick={toggleMobileMenu}
                      href={item.href}
                      className={`transition-all px-3 py-2 rounded-md text-sm font-medium hover:text-primary
                        ${
                          isActive
                            ? "font-bold text-primary"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="cursor-pointer py-2 px-3 text-gray-900 dark:text-gray-100 hover:text-primary"
              >
                {theme === "dark" ? (
                  <div className="text-sm flex items-center">
                    <SunIcon className="w-5 h-5 mr-3" /> Light Mode
                  </div>
                ) : (
                  <div className="text-sm flex items-center">
                    <MoonIcon className="w-5 h-5 mr-3" /> Dark Mode
                  </div>
                )}
              </button>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
