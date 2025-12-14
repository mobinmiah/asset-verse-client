import React from "react";
import Logo from "../Logo/Logo";
import { FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-100 text-base-content p-10 shadow-sm shadow-neutral rounded-lg">
      <aside>
        <Logo />
        <p className="font-bold">
          Asset Verse
          <br />
          Efficiently manage your physical assets!
        </p>
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>

      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="#" aria-label="Twitter">
            <FaXTwitter />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
