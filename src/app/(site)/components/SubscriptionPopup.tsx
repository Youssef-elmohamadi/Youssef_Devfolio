"use client";
import Image from "next/image";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface SubscriptionPopupProps {
  onClose: () => void;
  duration?: number; // Optional prop to set a custom duration in milliseconds
}

export default function SubscriptionPopup({
  onClose,
  duration = 3000,
}: SubscriptionPopupProps) {
  // This useEffect hook handles the temporary display
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Cleanup function to clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-white/95 dark:bg-[#0c0c0e]/95 border border-gray-150 dark:border-gray-800/80 backdrop-blur-md rounded-2xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl transform scale-100 transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon and Logo */}
        <div className="flex flex-col items-center mb-6">
          <FaCheckCircle className="text-green-500 text-5xl mb-5 animate-pulse" />
          <div className="hidden dark:block">
            <Image
              src="/logo/dark-logo.webp"
              width={130}
              height={86}
              alt="the Forge Logo"
              className="object-contain"
            />
          </div>
          <div className="block dark:hidden">
            <Image
              src="/logo/light-logo.webp"
              width={130}
              height={86}
              alt="the Forge Logo"
              className="object-contain"
            />
          </div>
        </div>

        {/* Success Message */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Successfully Subscribed!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm">
          Thank you for subscribing to our newsletter! Your email has been added, and you will receive the latest updates soon.
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
