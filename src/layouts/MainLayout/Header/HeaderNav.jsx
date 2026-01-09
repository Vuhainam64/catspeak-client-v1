import React from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Dropdown } from "antd"
import { FiChevronDown } from "react-icons/fi"
import { VietNam, China, USA } from "@assets/icons/flags"
import { useLanguage } from "../../../context/LanguageContext"

export const navLinks = [
  { key: "community", href: "/community", hasDropdown: true },
  { key: "catSpeak", href: "/cat-speak" },
  { key: "cart", href: "/cart" },
  { key: "connect", href: "/connect" },
]

const HeaderNav = () => {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  // Community dropdown menu items
  const communityMenuItems = [
    {
      key: "english",
      label: (
        <div className="flex items-center gap-3 px-2 py-1.5">
          <img
            src={USA}
            alt="English"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-gray-700">English</span>
        </div>
      ),
      onClick: () => {
        navigate("/community?language=english")
      },
    },
    {
      key: "vietnam",
      label: (
        <div className="flex items-center gap-3 px-2 py-1.5">
          <img
            src={VietNam}
            alt="Vietnam"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-gray-700">Việt Nam</span>
        </div>
      ),
      onClick: () => {
        navigate("/community?language=vietnamese")
      },
    },
    {
      key: "china",
      label: (
        <div className="flex items-center gap-3 px-2 py-1.5">
          <img
            src={China}
            alt="China"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-gray-700">
            Trung Quốc
          </span>
        </div>
      ),
      onClick: () => {
        navigate("/community?language=chinese")
      },
    },
  ]

  const renderNavItem = ({ key, href, hasDropdown, noActive }) => {
    const isActive = location.pathname.startsWith(href)

    // For items with noActive flag, never show active state
    const baseClassName = [
      "flex flex-1 whitespace-nowrap items-center justify-center py-3 px-12 gap-2 text-sm font-semibold uppercase tracking-wide rounded-full transition-all duration-200 hover:text-white",
      noActive
        ? "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]" // Always normal style
        : isActive
        ? "text-white bg-white/20 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]"
        : "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]",
    ].join(" ")

    if (hasDropdown && key === "community") {
      const dropdownClassName = [
        "flex flex-1 whitespace-nowrap items-center justify-center py-3 px-12 gap-2 text-sm font-semibold uppercase tracking-wide rounded-full transition-all duration-200 hover:text-white",
        isDropdownOpen || isActive
          ? "text-white bg-white/20 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]"
          : "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]",
      ].join(" ")

      return (
        <Dropdown
          key={key}
          menu={{ items: communityMenuItems }}
          trigger={["click"]}
          placement="bottom"
          classNames={{ root: "min-w-[200px]" }}
          onOpenChange={(open) => {
            setIsDropdownOpen(open)
          }}
        >
          <button className={dropdownClassName}>
            {t.nav[key]}
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </Dropdown>
      )
    }

    return (
      <NavLink key={key} to={href} className={baseClassName}>
        {t.nav[key]}
      </NavLink>
    )
  }

  return (
    <nav className="hidden items-center justify-between rounded-full bg-[linear-gradient(180deg,#f5c34a_0%,#f08d1d_20%,#c2131a_100%)] p-1 gap-1 text-white shadow-[0_4px_12px_rgba(194,19,26,0.2)] lg:flex">
      {navLinks.map(renderNavItem)}
    </nav>
  )
}

export default HeaderNav
