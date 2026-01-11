import React from "react";
import Logo from "../Logo/Logo";
import { FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-base-100 shadow-sm rounded-lg mt-8 sm:mt-12 lg:mt-16 print:hidden">
      <div className="footer footer-center p-4 sm:p-6 lg:p-10 text-base-content">
        <aside className="text-center">
          <div className="mb-4">
            <Logo />
          </div>
          <p className="font-bold text-sm sm:text-base lg:text-lg mb-2">
            Asset Verse
          </p>
          <p className="text-xs sm:text-sm text-base-content/70 mb-4">
            Efficiently manage your physical assets!
          </p>
          <p className="text-xs sm:text-sm text-base-content/60">
            Copyright © {new Date().getFullYear()} - All right reserved
          </p>
        </aside>

        <nav className="mt-4">
          <div className="flex gap-4 sm:gap-6">
            <a 
              href="#" 
              aria-label="Twitter"
              className="text-lg sm:text-xl hover:text-primary transition-colors duration-200 hover:scale-110 transform"
            >
              <FaXTwitter />
            </a>
            <a 
              href="#" 
              aria-label="YouTube"
              className="text-lg sm:text-xl hover:text-primary transition-colors duration-200 hover:scale-110 transform"
            >
              <FaYoutube />
            </a>
            <a 
              href="#" 
              aria-label="Facebook"
              className="text-lg sm:text-xl hover:text-primary transition-colors duration-200 hover:scale-110 transform"
            >
              <FaFacebookF />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
