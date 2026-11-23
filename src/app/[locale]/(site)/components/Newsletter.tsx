"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import SubscriptionPopup from "./SubscriptionPopup";

export default function Newsletter() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setShowPopup(true); 
        setEmail(""); 
      } else {
        const data = await res.json();
        setMessage(data.message || t("genericError"));
        setStatus("error");
      }
    } catch {
      setMessage(t("genericError"));
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 dark:border-gray-800/80 p-8 md:p-12 lg:p-16 shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-dark/50 backdrop-blur-md">
          {/* Glowing gradient backdrops */}
          <div className="absolute end-0 bottom-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -me-32 -mb-32" />
          <div className="absolute start-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -ms-32 -mt-32" />
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <h2 className="text-section font-heading font-bold mb-3 tracking-tight text-gray-900 dark:text-white">
                  {t("title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
                  {t("subtitle")}
                </p>
              </div>

              <div className="lg:col-span-6 w-full">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    id="newsletter-email"
                    aria-label="Email address for newsletter subscription"
                    placeholder={t("placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800/80 bg-white/60 dark:bg-black/30 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white font-medium tracking-wide px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 dark:shadow-primary/10 hover:shadow-primary/30 disabled:opacity-50 text-sm whitespace-nowrap active:scale-98"
                  >
                    {loading ? t("submitting") : t("button")}
                  </button>
                </form>

                {message && (
                  <p
                    className={`mt-4 text-xs font-semibold ${
                      status === "success"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <SubscriptionPopup onClose={() => setShowPopup(false)} />
      )}
    </section>
  );
}
