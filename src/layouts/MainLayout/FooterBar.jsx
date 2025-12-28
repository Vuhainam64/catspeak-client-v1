import React from "react";

import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { SiZalo } from "react-icons/si";

import { Tower, Mountain, FooterBG } from "@assets/images/home/footer";
import { IconLogo } from "@/assets/icons/logo";
import { Link } from "react-router-dom";
import { useLanguage } from "@context/LanguageContext.jsx";

const founders = [
  {
    name: "Nguyễn Ngọc Diễm Quỳnh",
    role: "Founder / CEO",
    avatar: "https://i.pravatar.cc/120?img=5",
  },
  {
    name: "Nguyễn Phạm Đăng Quang",
    role: "CTO",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
  {
    name: "Nguyễn Ngọc Gia Hân",
    role: "CSMO",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
];

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
      <style>
        {`@keyframes founder-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }`}
      </style>
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
              <div className="w-full grid grid-cols-11 gap-8 px-8 text-white pt-10">
                <div className="col-span-3">
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
                <div className="col-span-4">
                  <div className="font-bold text-xl uppercase text-center tracking-wide">
                    {footerText.foundingTeam}
                  </div>
                  <div className="relative mt-3 overflow-hidden">
                    <div className="flex flex-col gap-5 animate-[founder-scroll_15s_linear_infinite]">
                      {[...founders, ...founders].map(
                        ({ name, role, avatar }, idx) => (
                          <div
                            key={`${name}-${idx}`}
                            className="flex items-center gap-4 rounded-full bg-white/10 px-4 py-2 shadow backdrop-blur-sm"
                          >
                            <div className="h-16 w-16 rounded-full border-2 border-white/70 p-1">
                              <img
                                src={avatar}
                                alt={name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-base font-semibold">{name}</p>
                              <p className="text-sm uppercase text-white/70">
                                {role}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
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
              <div className="absolute w-full grid grid-cols-11 bottom-0">
                <div className="col-span-3 flex justify-between px-12 py-4 text-yellow-300 ">
                  <Link>{footerText.policies.privacy}</Link>
                  <Link>{footerText.policies.terms}</Link>
                </div>
                <div className="col-span-3 pt-6">
                  <div className="flex items-center justify-center text-gray-400 uppercase">
                    {footerText.copyright}
                  </div>
                </div>
                <div className="col-span-3 flex justify-between px-12 py-4 text-yellow-300">
                  <Link>{footerText.policies.payment}</Link>
                  <Link>{footerText.policies.copyright}</Link>
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
