import "./globals.css";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const DeveloperGrid = dynamic(
  () => import("./components/hero/DeveloperGrid"),
  { ssr: false }
);

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full overflow-x-clip bg-transparent">
      {/* Global Background Grid */}
      <DeveloperGrid />
      <Navbar />
      <main className="min-h-screen pb-28 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
