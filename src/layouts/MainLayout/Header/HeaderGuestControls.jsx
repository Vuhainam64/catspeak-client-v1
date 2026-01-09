import React from "react"
import { useLanguage } from "../../../context/LanguageContext"

const HeaderGuestControls = ({ onGetStarted }) => {
  const { t } = useLanguage()

  const handleLogin = () => {
    if (onGetStarted) {
      onGetStarted("login") // Open modal
    }
  }

  return (
    <>
      <button
        className="rounded-full bg-cath-red-700 px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(194,19,26,0.35)] transition hover:bg-cath-red-800 whitespace-nowrap"
        onClick={handleLogin}
      >
        {t.auth.loginButton}
      </button>
    </>
  )
}

export default HeaderGuestControls
