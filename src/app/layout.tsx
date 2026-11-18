import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeContextProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-white transition-colors dark:bg-gray-900 dark:text-white ${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeContextProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeContextProvider>
        <Script
          id="bmc-widget"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-name="BMC-Widget"
          data-cfasync="false"
          data-id="elmohammadi"
          data-description="Support me on Buy me a coffee!"
          data-message=""
          data-color="#FF813F"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
