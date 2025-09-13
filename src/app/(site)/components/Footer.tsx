import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-800 relative z-10">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              href="/"
              className="text-xl block dark:hidden font-bold text-primary"
            >
              <Image
                src="/logo/light-logo.webp"
                width={150}
                height={100}
                alt="the Forge Logo"
              />
            </Link>
            <Link
              href="/"
              className="text-xl hidden dark:block font-bold text-primary"
            >
              <Image
                src="/logo/dark-logo.webp"
                width={150}
                height={100}
                alt="the Forge Logo"
              />
            </Link>
            <p className="text-sm text-center md:text-left text-secondary mt-2">
              © {new Date().getFullYear()} Youssef Elmohamadi{" "}
              <span className="text-primary">The Forge</span>. All rights
              reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/Youssef-elmohamadi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com/elmohamadidev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
            >
              <FaTwitter className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/el-mohamadi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
