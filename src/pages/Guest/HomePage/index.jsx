import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HoGuomBaner, Hero1VI, Hero1EN, BannerAIVI, BannerAIEN, BGTicket } from "@assets/images/home";
import { VietNam, China, USA } from "@assets/icons/flags";
import { useLanguage } from "@context/LanguageContext.jsx";
import { LoginPopup, RegisterPopup } from "@components";
import LiquidGlassButton from "@components/LiquidGlassButton";
// IMPORT react-icons
import { FiPlus, FiMinus } from "react-icons/fi";

const HomePage = () => {
  const { t, language } = useLanguage();

  // Select images based on current language
  const Hero1 = language === 'en' ? Hero1EN : Hero1VI;
  const BannerAI = language === 'en' ? BannerAIEN : BannerAIVI;
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  });
  const [expandedQuestions, setExpandedQuestions] = useState(new Set()); // Multiple questions can be expanded
  const [searchQuery, setSearchQuery] = useState("");

  // Handle question expansion - Independent toggle for each question
  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        // Question is open -> Close it
        newSet.delete(index);
        console.log('Closing question:', index);
      } else {
        // Question is closed -> Open it
        newSet.add(index);
        console.log('Opening question:', index);
      }
      console.log('Currently expanded questions:', Array.from(newSet));
      return newSet;
    });
  };

  const openAuthModal = (mode = "login") =>
    setAuthModal({
      isOpen: true,
      mode,
    });

  const closeAuthModal = () =>
    setAuthModal((prev) => ({
      ...prev,
      isOpen: false,
    }));

  const switchAuthMode = (mode) => openAuthModal(mode);

  const languages = [
    { flag: VietNam, name: t.home.countries.vietnam, code: "vi" },
    { flag: China, name: t.home.countries.china, code: "cn" },
    { flag: USA, name: t.home.countries.usa, code: "en" },
  ];

  useEffect(() => {
    if (!authModal.isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [authModal.isOpen]);

  const renderAuthPopup = () => {
    if (!authModal.isOpen) return null;

    const popup =
      authModal.mode === "register" ? (
        <RegisterPopup onClose={closeAuthModal} onSwitchMode={switchAuthMode} />
      ) : (
        <LoginPopup onClose={closeAuthModal} onSwitchMode={switchAuthMode} />
      );

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8">
        <div
          className="absolute inset-0"
          role="button"
          aria-label="Close authentication modal"
          onClick={closeAuthModal}
        />
        <div className="relative z-10 w-full max-w-xl">{popup}</div>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex flex-col max-w-screen-xl">
      <div className="relative w-full pt-4">
        {/* Main Hero Section */}
        <div className="relative mx-auto overflow-visible rounded-[32px] bg-gradient-to-b from-cath-red-500 via-cath-red-700 to-[#f08d1d] p-8 md:p-12 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Banner Image */}
            <div className="relative">
              {/* Card ảnh */}
              <div className="relative overflow-hidden rounded-[28px]">
                {/* Ảnh chính */}
                <img
                  src={HoGuomBaner}
                  alt="Hoàn Kiếm Lake"
                  className="w-full h-52 object-cover md:h-64 lg:h-[320px]"
                />

                {/* Nút phía dưới ảnh */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-row-reverse gap-4 z-20">
                  <LiquidGlassButton
                    onClick={() => openAuthModal("login")}
                    variant="default"
                    className="flex-1 max-w-[220px] rounded-[999px] px-6 py-3 text-sm font-semibold text-white"
                  >
                    {t.auth.loginButton}
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    onClick={() => openAuthModal("register")}
                    variant="yellow"
                    className="flex-1 max-w-[220px] rounded-[999px] px-6 py-3 text-sm font-semibold text-white"
                  >
                    {t.auth.registerButton}
                  </LiquidGlassButton>
                </div>
              </div>

              {/* Khung trắng trang trí ở góc dưới trái (giống mẫu) */}
              <div className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-28 rounded-[20px] border-2 border-white/60" />
            </div>

            {/* Right Side - Text Content */}
            <div className="flex items-center h-full">
              <div className="h-full w-full rounded-[24px] border-2 border-white/30 bg-white/10 p-8 backdrop-blur-sm lg:p-12">
                <h1 className="mb-6 text-3xl font-black leading-tight text-[#f4ab1b] lg:text-4xl xl:text-5xl">
                  {t.home.heroTitle}
                </h1>
                <p className="text-lg leading-relaxed text-white lg:text-xl">
                  {t.home.heroSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Languages row that overlaps hero bottom - Absolute positioned outside */}
        <div className="absolute px-4 md:px-8 z-10 left-3 -bottom-14">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {languages.map((lang, idx) => (
              <div
                key={lang.code}
                className={`relative flex items-center gap-4 rounded-[16px] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition hover:shadow-xl ${idx === 0 ? "md:ml-6" : ""
                  }`}
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section - Hero1 */}
      <div className="mt-24 w-full px-4 md:px-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            <div className="text-xl uppercase text-gray-500 font-bold">
              {t.home.whyChooseUs}
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {t.home.valuesTitle}
            </div>
          </div>
          <img
            src={Hero1}
            alt="Cat Speak Values"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* AI Technology Section */}
      <div className="mt-24 w-full px-4 md:px-8 pb-16">
        <div className="mx-auto max-w-screen-xl grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left Side - Banner Image */}
          <div className="relative order-2 lg:order-1">
            <img
              src={BannerAI}
              alt="AI Learning Platform"
              className="w-full h-auto"
            />
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center space-y-6 order-1 lg:order-2">
            {/* Header */}
            <div className="relative inline-block pb-2">
              <div className="text-sm uppercase tracking-wider text-gray-500 font-bold">
                {t.home.aiSection.header}
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 bg-cath-red-800" style={{ width: '20%' }} />
            </div>

            {/* Title */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              {t.home.aiSection.title}
            </div>

            {/* Main Heading */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
              {t.home.aiSection.mainHeading}
            </h2>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {t.home.aiSection.description}
            </p>

            {/* Features List */}
            <ul className="space-y-4">
              {t.home.aiSection.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-base md:text-lg text-gray-700 flex-1">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Call to Action Button */}
            <div className="pt-4">
              <LiquidGlassButton
                variant="yellow"
                className="rounded-[999px] px-8 py-4 text-base font-semibold text-white"
              >
                {t.home.aiSection.learnMore}
              </LiquidGlassButton>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 w-full px-4 md:px-8 pb-16">
        <div className="relative mx-auto max-w-screen-xl">
          {/* Background Ticket Image */}
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={BGTicket}
              alt="FAQ Background"
              className="w-full h-auto object-cover"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 md:mb-10">
                <div className="flex-1 mb-6 md:mb-0">
                  {/* Corner Label with underline */}
                  <div className="relative inline-block mb-3">
                    <div className="text-sm md:text-base uppercase tracking-[0.15em] text-cath-yellow-400 font-bold">
                      {t.home.faq.corner}
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-cath-yellow-400" style={{ width: '50%' }} />
                  </div>
                  {/* Main Title */}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {t.home.faq.title}
                  </h2>
                </div>

                {/* Search Bar - Positioned to overlap */}
                <div className="md:absolute md:top-8 md:right-8 lg:top-12 lg:right-12">
                  <div className="relative border-2 border-cath-red-800 rounded-xl px-5 py-3.5 shadow-search flex items-center gap-3 min-w-[240px] md:min-w-[280px] transition-all hover:border-cath-red-900 hover:shadow-lg">
                    <svg
                      className="w-5 h-5 text-gray-300 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder={t.home.faq.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-white placeholder-gray-400 text-sm md:text-base bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* FAQ Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 md:gap-x-6 flex-1 p-4 items-start">
                {t.home.faq.questions.map((item, originalIndex) => {
                  // Check if question matches search query
                  const matchesSearch =
                    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchQuery.toLowerCase());

                  if (!matchesSearch) return null;

                  const isExpanded = expandedQuestions.has(originalIndex);

                  return (
                    <div
                      key={originalIndex}
                      className={`rounded-xl border transition-all duration-300 ease-in-out ${isExpanded
                        ? "bg-gradient-to-br from-orange-500/50 to-red-600/50 border-white/70 shadow-faq-card-expanded backdrop-blur-sm"
                        : "bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/50 shadow-faq-card backdrop-blur-sm"
                        }`}
                    >
                      <button
                        onClick={() => toggleQuestion(originalIndex)}
                        className="w-full p-4 md:p-5 flex items-center justify-between text-left group"
                      >
                        <span
                          className={`flex-1 text-base md:text-lg font-bold leading-snug pr-4 ${isExpanded ? "text-white" : "text-white group-hover:text-white/90"
                            }`}
                        >
                          {item.question}
                        </span>
                        <div className="ml-2 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                          {isExpanded ? (
                            <FiMinus className="w-5 h-5 text-cath-red-800" aria-hidden />
                          ) : (
                            <FiPlus className="w-5 h-5 text-cath-yellow-400" aria-hidden />
                          )}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                          <div className="h-px bg-white/20 mb-4"></div>
                          <p className="text-white/95 text-sm md:text-base leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {renderAuthPopup()}
    </div>
  );
};

export default HomePage;
