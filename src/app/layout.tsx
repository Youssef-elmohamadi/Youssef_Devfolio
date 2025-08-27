import { Outfit } from "next/font/google";

import { ThemeContextProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeContextProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
