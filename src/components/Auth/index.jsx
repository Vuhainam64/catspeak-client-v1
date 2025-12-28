import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import LoginPopup from './LoginPopup'
import RegisterPopup from './RegisterPopup'
import ForgotPasswordPopup from './ForgotPasswordPopup'

const Auth = ({ isOpen, mode = 'login', onClose, onSwitchMode }) => {
  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  const renderPopup = () => {
    switch (mode) {
      case 'register':
        return <RegisterPopup onClose={onClose} onSwitchMode={onSwitchMode} />
      case 'forgot':
        return <ForgotPasswordPopup onClose={onClose} onSwitchMode={onSwitchMode} />
      default:
        return <LoginPopup onClose={onClose} onSwitchMode={onSwitchMode} />
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
      <div className="relative z-10 w-full max-w-xl">{renderPopup()}</div>
    </div>,
    document.body
  )
}

export default Auth

