"use client";
import { useSidebar } from "@/app/context/SidebarContext";
import AppHeader from "@/app/[locale]/(site)/components/AppHeader";
import AppSidebar from "@/app/[locale]/(site)/components/AppSidebar";
import Backdrop from "@/app/[locale]/(site)/components/Backdrop";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ms-0"
    : isExpanded || isHovered
    ? "lg:ms-[290px]"
    : "lg:ms-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
