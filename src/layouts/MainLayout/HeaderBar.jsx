import React from "react"
import { ConfigProvider, Drawer } from "antd"
import { NavLink } from "react-router-dom"
import { FiMenu } from "react-icons/fi"
import HeaderLogo from "./Header/HeaderLogo"
import HeaderNav, { navLinks } from "./Header/HeaderNav"
import HeaderUserControls from "./Header/HeaderUserControls"
import HeaderGuestControls from "./Header/HeaderGuestControls"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useLanguage } from "@/context/LanguageContext"

import useAuth from "@/hooks/useAuth"

const HeaderBar = ({ onGetStarted }) => {
  // Simplified check for token presence
  const { isAuthenticated: isLoggedIn } = useAuth()
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur border-b">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-8 py-5 max-md:px-4">
        {/* Left Section: Burger (Mobile) + Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center justify-center p-2 text-gray-600 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <HeaderLogo />
        </div>

        {/* Center Section: Desktop Nav */}
        <div className="hidden lg:block">
          <HeaderNav />
        </div>

        {/* Right Section: Controls */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <div className="hidden lg:block">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#f08d1d",
                  borderRadius: 8,
                },
              }}
            >
              <LanguageSwitcher />
            </ConfigProvider>
          </div>
          {isLoggedIn ? (
            <HeaderUserControls />
          ) : (
            <HeaderGuestControls onGetStarted={onGetStarted} />
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        classNames={{ body: "p-0" }}
      >
        <div className="flex flex-col p-4 space-y-4">
          {/* Mobile Language Switcher */}
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>

          <nav className="flex flex-col gap-2">
            <MobileNavLinks onClose={() => setDrawerOpen(false)} />
          </nav>
        </div>
      </Drawer>
    </header>
  )
}

const MobileNavLinks = ({ onClose }) => {
  const { t } = useLanguage()

  return (
    <>
      {navLinks.map(({ key, href }) => (
        <NavLink
          key={key}
          to={href}
          onClick={onClose}
          className={({ isActive }) =>
            [
              "flex items-center py-3 px-4 rounded-xl text-base font-semibold transition-colors",
              isActive
                ? "bg-[#990011]/10 text-[#990011]"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")
          }
        >
          {t.nav[key]}
        </NavLink>
      ))}
    </>
  )
}

export default HeaderBar
