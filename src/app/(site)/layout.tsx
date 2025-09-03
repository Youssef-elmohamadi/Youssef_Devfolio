
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    {/*<HandDrawnMathBackground/>*/}
      <Navbar />
      <main className="min-h-screen pt-24">{children}</main>
      <Footer />
    </>
  );
}
