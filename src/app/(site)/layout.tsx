import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DeveloperGrid from "./components/hero/DeveloperGrid";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      {/* Global Background Grid */}
      <DeveloperGrid />
      <Navbar />
      <main className="min-h-screen pb-28 pt-8 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
