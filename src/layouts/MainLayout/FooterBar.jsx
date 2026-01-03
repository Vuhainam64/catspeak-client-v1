import React from "react";

import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { SiZalo } from "react-icons/si";

import { Tower, Mountain, FooterBG } from "@assets/images/home/footer";
import { IconLogo } from "@/assets/icons/logo";
import { Link } from "react-router-dom";
import { useLanguage } from "@context/LanguageContext.jsx";



const FooterBar = () => {
  const { t } = useLanguage();
  const footerText = t.footer;

  const languages = [
    footerText.languages.vietnamese,
    footerText.languages.english,
    footerText.languages.chinese,
  ];

  return (
    <footer className="relative overflow-hidden bg-white">

      {/* Title */}
      <div className="w-full flex items-center justify-center text-xl uppercase text-gray-500 font-bold">
        {footerText.title}
      </div>

      {/* Tower & Mountain nằm ngoài để không bị ảnh hưởng px-8 py-4 */}
      <img
        src={Tower}
        alt="Tower"
        className="absolute bottom-0 left-0 z-0 w-[1100px]"
      />

      <img
        src={Mountain}
        alt="Mountain"
        className="absolute bottom-0 right-0 z-0 w-[350px]"
      />

      {/* Vùng nội dung có padding */}
      <div className="relative flex w-full justify-center px-8 py-4">
        <div className="relative w-full max-w-screen-xl aspect-[1788/434] justify-center">
          {/* Background FooterBG */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-80 z-10"
            style={{ backgroundImage: `url(${FooterBG})` }}
          />

          <div className="relative grid grid-cols-12 gap-4 z-20 h-full">
            {/* Logo */}
            <img
              src={IconLogo}
              alt="logo"
              className="col-span-1 w-full pb-4 pr-4"
            />
            <div className="flex flex-col justify-between w-full col-span-11 gap-4">
              <div className="w-full grid grid-cols-9 gap-8 px-8 text-white pt-10">
                <div className="col-span-4">
                  <div className="font-bold text-xl uppercase tracking-wide">
                    {footerText.ourCommunity}
                  </div>
                  <ul className="space-y-3 text-lg pt-6 text-white/85">
                    {languages.map((lang) => (
                      <li key={lang} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-white/70" />
                        <span>{lang}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-5">
                  <div className="font-bold text-xl uppercase text-center tracking-wide mb-4">
                    {footerText.contactUs}
                  </div>
                  <div className="px-4">
                    <form className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder={footerText.fullNamePlaceholder}
                        className="rounded-full border border-white/60 bg-white/90 px-5 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-yellow-300 focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder={footerText.emailPlaceholder}
                        className="rounded-full border border-white/60 bg-white/90 px-5 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-yellow-300 focus:outline-none"
                      />
                    </form>
                    <div className="mt-4 flex items-center justify-between text-sm text-white/90">
                      <p className="flex-1 pr-4 italic">
                        <span className="font-bold text-lg">Cat Speak </span>
                        {footerText.contactMessage}
                      </p>
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 text-[#bc1e46] shadow-lg transition hover:scale-105"
                        aria-label={footerText.sendContact}
                      >
                        <FiSend size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bottom policy links and copyright */}
              <div className="absolute w-full bottom-0 left-0 right-0 px-12">
                <div className="flex items-center justify-between py-4">
                  {/* Left policies */}
                  <div className="flex gap-8 text-yellow-300 text-sm">
                    <Link className="hover:text-yellow-400 transition">{footerText.policies.privacy}</Link>
                    <Link className="hover:text-yellow-400 transition">{footerText.policies.terms}</Link>
                  </div>

                  {/* Center copyright */}
                  <div className="text-gray-400 uppercase text-xs text-center flex-shrink-0 mx-4">
                    {footerText.copyright}
                  </div>

                  {/* Right policies */}
                  <div className="flex gap-8 text-yellow-300 text-sm">
                    <Link className="hover:text-yellow-400 transition">{footerText.policies.payment}</Link>
                    <Link className="hover:text-yellow-400 transition">{footerText.policies.copyright}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
