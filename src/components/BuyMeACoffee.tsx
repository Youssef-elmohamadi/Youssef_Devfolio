"use client";

import { motion } from "framer-motion";
import { FaCoffee } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function BuyMeACoffee() {
  const t = useTranslations("coffee");

  return (
    <motion.a
      href="https://www.buymeacoffee.com/elmohammadi"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("support")}
      title={t("support")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 6 }}
      whileTap={{ scale: 0.9 }}
      className="buy-me-coffee-btn fixed bottom-[68px] end-4 sm:bottom-6 sm:end-6 z-40 sm:z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xl hover:shadow-orange-500/35 transition-all duration-300 border border-white/20"
    >
      <FaCoffee className="w-5 h-5 text-white" />
    </motion.a>
  );
}
