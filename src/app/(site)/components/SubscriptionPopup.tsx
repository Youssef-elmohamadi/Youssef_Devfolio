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
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-dark rounded-lg p-12 max-w-lg w-full text-center shadow-2xl transform transition-transform duration-300 scale-100 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <div className="hidden dark:block">
            <Image
              src="/logo/dark-logo.webp"
              width={150}
              height={100}
              alt="the Forge Logo"
            />
          </div>
          <div className="block dark:hidden">
            <Image
              src="/logo/light-logo.webp"
              width={150}
              height={100}
              alt="the Forge Logo"
            />
          </div>
        </div>

        {/* Success Message */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
          Thank you for subscribing to our newsletter!
          <br />
          Your email has been successfully added, and you will receive the
          latest updates soon.
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
