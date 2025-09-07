"use client";
import { useState } from "react";
import SubscriptionPopup from "./SubscriptionPopup";

export default function Newsletter() {
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
        setShowPopup(true); // إظهار النافذة المنبثقة عند النجاح
        setEmail(""); // مسح حقل الإيميل
      } else {
        const data = await res.json();
        setMessage(data.message);
        setStatus("error");
      }
    } catch (error) {
      setMessage("حدث خطأ ما.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="bg-white dark:bg-dark rounded-lg overflow-hidden animate-slide-up">
        <div className="p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Subscribe to My Newsletter
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Get the latest updates on my projects, blog posts, and tech
                  insights delivered straight to your inbox.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white text-gray-700 dark:text-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Subscribe"}
                </button>
              </form>

              {message && (
                <p
                  className={`mt-4 text-sm ${
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
      {showPopup && <SubscriptionPopup onClose={() => setShowPopup(false)} />}
    </section>
  );
}
