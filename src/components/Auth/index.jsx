import { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence } from "framer-motion"
import LoginPopup from "./LoginPopup"
import RegisterPopup from "./RegisterPopup"
import ForgotPasswordPopup from "./ForgotPasswordPopup"

const Auth = ({ isOpen, mode = "login", onClose, onSwitchMode }) => {
  if (!isOpen) return null

  const renderPopup = () => {
    switch (mode) {
      case "register":
        return (
          <RegisterPopup
            key="register"
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )
      case "forgot":
        return (
          <ForgotPasswordPopup
            key="forgot"
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )
      default:
        return (
          <LoginPopup
            key="login"
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8">
      <div
        className="absolute inset-0"
        role="button"
        aria-label="Close authentication modal"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl">
        <AnimatePresence mode="wait">{renderPopup()}</AnimatePresence>
      </div>
    </div>,
    document.body
  )
}

export default Auth
