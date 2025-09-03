import AppHeader from "@/app/(site)/components/AppHeader";
import AppSidebar from "@/app/(site)/components/AppSidebar";
import Backdrop from "@/app/(site)/components/Backdrop";
import { SidebarProvider, useSidebar } from "@/app/context/SidebarContext";
import React from "react";
import "./globals.css";
import { ThemeContextProvider } from "@/app/context/ThemeContext";
import { generateSEO } from "@/utils/seo";
export const metadata = generateSEO({
  title: "Admin Dashboard | Youssef Elmohamadi",
  description: "Manage projects, blogs, and site settings from the admin dashboard.",
  url: "https://youssef-devfolio.vercel.app/admin",
  type: "website",
  robots: "noindex, nofollow",
  keywords: [
    "admin",
    "dashboard",
    "Youssef Elmohamadi",
    "portfolio management",
    "content management",
  ],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ThemeContextProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ThemeContextProvider>
    </SidebarProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
