import { Inter, JetBrains_Mono, Plus_Jakarta_Sans, Cairo } from "next/font/google";
import BuyMeACoffee from "@/components/BuyMeACoffee";
import { ThemeContextProvider } from "@/app/context/ThemeContext";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { LocaleSlugProvider } from "@/context/LocaleSlugContext";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Youssef Elmohamadi | Frontend Developer | The Forge",
  description:
    "Hi, I'm Youssef, a Frontend Developer and Computer Science student. Explore my projects and articles on React, Next.js, and more.",
  keywords: [
    "Youssef Elmohamadi",
    "Frontend Developer",
    "React",
    "Next.js",
    "Computer Science",
    "portfolio",
    "the Forge",
  ],
  openGraph: {
    title: "Youssef Elmohamadi | Frontend Developer | The Forge",
    description:
      "Hi, I'm Youssef, a Frontend Developer and Computer Science student. Explore my projects and articles on React, Next.js, and more.",
    url: "https://the-forge-one.vercel.app/",
    images: ["https://the-forge-one.vercel.app/elmohammadi.jpg"],
    siteName: "the Forge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@elmohamadidev",
    creator: "@elmohamadidev",
    title: "Youssef Elmohamadi | Frontend Developer | The Forge",
    description:
      "Hi, I'm Youssef, a Frontend Developer and Computer Science student. Explore my projects and articles on React, Next.js, and more.",
    images: ["https://the-forge-one.vercel.app/elmohammadi.jpg"],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={locale === "ar" ? "font-arabic" : ""}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  function syncLocale(e) {
    try {
      var preferred = localStorage.getItem('user_lang_pref');
      if (!preferred || (preferred !== 'en' && preferred !== 'ar')) return;
      var path = window.location.pathname;
      var segs = path.split('/').filter(Boolean);
      var cur = segs[0];
      if ((cur === 'en' || cur === 'ar') && cur !== preferred) {
        if (e && e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
        segs[0] = preferred;
        var target = '/' + segs.join('/') + window.location.search + window.location.hash;
        console.log('[CapturePopState] Back/Forward detected mismatch:', cur, '-> preferred:', preferred, 'redirecting to:', target);
        window.location.replace(target);
      }
    } catch (err) {}
  }

  window.addEventListener('popstate', syncLocale, true);
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      syncLocale(e);
    }
  });
})();
`,
          }}
        />
      </head>
      <body
        className={`bg-white font-sans text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-100 ${inter.variable} ${plusJakartaSans.variable} ${jetBrainsMono.variable} ${cairo.variable} ${locale === "ar" ? cairo.className : inter.className} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSlugProvider>
            <ThemeContextProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeContextProvider>
            <BuyMeACoffee />
          </LocaleSlugProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
