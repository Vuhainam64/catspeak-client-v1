import React, { useState, useEffect, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  FiShoppingCart,
  FiChevronDown,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi"
import { MainLogo } from "@assets/icons/logo"
import { useLanguage } from "../../context/LanguageContext.jsx"
import { useLogoutMutation } from "@/store/api/authApi"

const navLinks = [
  { key: "community", href: "/" },
  { key: "catSpeak", href: "/rooms" },
  { key: "cart", href: "/cart" },
  { key: "connect", href: "/connect" },
]

const HeaderBar = ({ onGetStarted }) => {
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()

  // Simplified check for token presence
  const isLoggedIn = !!localStorage.getItem("token")

  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false)
  const langDropdownRef = useRef(null)
  const avatarDropdownRef = useRef(null)

  const [logout] = useLogoutMutation()

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setShowLangDropdown(false)
      }
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target)
      ) {
        setShowAvatarDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogin = () => {
    navigate("/login")
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      navigate("/login") // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error)
    }
    setShowAvatarDropdown(false)
  }

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur border-b">
      <div className="mx-auto grid max-w-screen-xl grid-cols-[1fr_4fr_1fr] items-center gap-6 px-8 py-5 max-lg:grid-cols-1 max-lg:gap-4 max-md:px-4">
        <div className="flex items-center gap-4 max-lg:justify-between">
          <Link
            to="/"
            className="flex items-center gap-4"
            aria-label="Cath Speak Home"
          >
            <img src={MainLogo} alt="Cath Speak logo" className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="hidden w-full items-center justify-between rounded-full bg-[linear-gradient(180deg,#f5c34a_0%,#f08d1d_20%,#c2131a_100%)] px-6 py-3 text-white shadow-[0_15px_32px_rgba(194,19,26,0.35)] lg:flex">
          {navLinks.map(({ key, href }) => (
            <NavLink
              key={key}
              to={href}
              className={({ isActive }) =>
                [
                  "flex flex-1 items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide transition",
                  isActive ? "text-white" : "text-white/80 hover:text-white",
                ].join(" ")
              }
            >
              {key === "cart" ? (
                <>
                  {t.nav[key]}
                  <FiShoppingCart className="text-lg" />
                </>
              ) : (
                <>
                  {t.nav[key]}
                  {key === "community" && (
                    <FiChevronDown className="text-base" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4">
          {isLoggedIn ? (
            <>
              {/* Language Dropdown */}
              <div className="relative hidden lg:block" ref={langDropdownRef}>
                <button
                  className="flex items-center gap-1 text-sm font-bold text-[#f4ab1b] hover:text-[#f5c34a] transition"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                >
                  {language === "vi" ? (
                    <span className="whitespace-nowrap">Tiếng Việt</span>
                  ) : (
                    <span className="whitespace-nowrap">English</span>
                  )}
                  <FiChevronDown className="text-[#f4ab1b]" />
                </button>
                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-2 rounded-lg bg-white shadow-lg border border-gray-200 py-2 min-w-[140px] z-30">
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                      onClick={() => {
                        if (language !== "vi") toggleLanguage()
                        setShowLangDropdown(false)
                      }}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                      onClick={() => {
                        if (language !== "en") toggleLanguage()
                        setShowLangDropdown(false)
                      }}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <button className="relative hidden lg:flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-[#f5c34a] to-[#c2131a] shadow-lg">
                <FiBell className="h-5 w-5 text-white" />
              </button>

              {/* Avatar Dropdown */}
              <div className="relative" ref={avatarDropdownRef}>
                <button
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-[#f5c34a] to-[#c2131a] shadow-lg hover:shadow-xl transition"
                  onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                >
                  <FiUser className="h-5 w-5 text-white" />
                </button>
                {showAvatarDropdown && (
                  <div className="absolute right-0 top-full mt-2 rounded-lg bg-white shadow-lg border border-gray-200 py-2 min-w-[160px] z-30">
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                      onClick={() => {
                        setShowAvatarDropdown(false)
                        navigate("/app/setting")
                      }}
                    >
                      <FiSettings className="h-4 w-4" />
                      Setting
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="hidden items-center gap-1 text-sm font-semibold text-[#f4ab1b] lg:flex"
                onClick={toggleLanguage}
              >
                {language === "vi" ? (
                  <span className="whitespace-nowrap">Tiếng Việt</span>
                ) : (
                  <span className="whitespace-nowrap">English</span>
                )}
                <FiChevronDown />
              </button>
              <button
                className="rounded-full bg-cath-red-700 px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(194,19,26,0.35)] transition hover:bg-cath-red-800 whitespace-nowrap"
                onClick={handleLogin}
              >
                {t.getStarted}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderBar
