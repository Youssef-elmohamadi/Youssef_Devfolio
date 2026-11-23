import React from "react";
import "../../globals.css";
import { SidebarProvider } from "@/app/context/SidebarContext";
import { ThemeContextProvider } from "@/app/context/ThemeContext";
import { generateSEO } from "@/utils/seo";
import AdminLayoutClient from "./AdminLayoutClient"; 

export const metadata = generateSEO({
  title: "Admin Dashboard | Youssef Elmohamadi",
  description:
    "Manage projects, blogs, and site settings from the admin dashboard.",
  type: "website",
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
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </ThemeContextProvider>
    </SidebarProvider>
  );
}
