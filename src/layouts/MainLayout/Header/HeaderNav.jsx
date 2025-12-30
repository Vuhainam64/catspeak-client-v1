import React from "react"
import { NavLink } from "react-router-dom"
import { useLanguage } from "../../../context/LanguageContext"

export const navLinks = [
  { key: "community", href: "/" },
  { key: "catSpeak", href: "/rooms" },
  { key: "cart", href: "/cart" },
  { key: "connect", href: "/connect" },
]

const HeaderNav = () => {
  const { t } = useLanguage()

  return (
    <nav className="hidden items-center justify-between rounded-full bg-[linear-gradient(180deg,#f5c34a_0%,#f08d1d_20%,#c2131a_100%)] p-1 gap-1 text-white shadow-[0_4px_12px_rgba(194,19,26,0.2)] lg:flex">
      {navLinks.map(({ key, href }) => (
        <NavLink
          key={key}
          to={href}
          className={({ isActive }) =>
            [
              "flex flex-1 whitespace-nowrap items-center justify-center py-3 px-12 gap-2 text-sm font-semibold uppercase tracking-wide rounded-full transition-all duration-200 hover:text-white",
              isActive
                ? "text-white bg-white/20 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]"
                : "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]",
            ].join(" ")
          }
        >
          {t.nav[key]}
        </NavLink>
      ))}
    </nav>
  )
}

export default HeaderNav
