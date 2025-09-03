import { Outfit } from "next/font/google";
import { ThemeContextProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import type { Metadata } from "next";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youssef Elmohamadi | Frontend Developer | The Forge",
  description: "Hi, I'm Youssef, a Frontend Developer and Computer Science student. Explore my projects and articles on React, Next.js, and more.",
  keywords: ["Youssef Elmohamadi", "Frontend Developer", "React", "Next.js", "Computer Science", "portfolio", "the Forge"],
  openGraph: {
    title: "Youssef Elmohamadi | Frontend Developer | The Forge",
    description: "Hi, I'm Youssef, a Frontend Developer and Computer Science student. Explore my projects and articles on React, Next.js, and more.",
    url: "https://youssef-devfolio.vercel.app/",
    images: ["https://youssef-devfolio.vercel.app/elmohammadi.jpg"],
    siteName: "the Forge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@elmohamadidev",
    creator: "@elmohamadidev",
    title: "Youssef Elmohamadi | Frontend Developer | The Forge",
    description: "Hi, I'm Youssef, a Frontend Developer and Computer Science student. Explore my projects and articles on React, Next.js, and more.",
    images: ["https://youssef-devfolio.vercel.app/elmohammadi.jpg"],
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
        className={`bg-white transition-colors dark:bg-gray-900 dark:text-white ${outfit.className}`}
      >
        <ThemeContextProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}