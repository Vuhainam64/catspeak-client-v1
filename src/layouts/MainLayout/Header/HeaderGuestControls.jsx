import React from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../../context/LanguageContext"

const HeaderGuestControls = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <>
      <button
        className="rounded-full bg-cath-red-700 px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(194,19,26,0.35)] transition hover:bg-cath-red-800 whitespace-nowrap"
        onClick={handleLogin}
      >
        {t.getStarted}
      </button>
    </>
  )
}

export default HeaderGuestControls
