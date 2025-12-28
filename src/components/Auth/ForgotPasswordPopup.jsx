import { FiX } from 'react-icons/fi'
import { useLanguage } from '@context/LanguageContext.jsx'
import LiquidGlassButton from '@components/LiquidGlassButton'

const ForgotPasswordPopup = ({ onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth

  return (
    <div className="relative rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      <button
        type="button"
        aria-label="Close"
        className="absolute right-6 top-6 text-2xl text-gray-500 transition hover:text-gray-700"
        onClick={onClose}
      >
        <FiX />
      </button>

      <h2 className="text-center text-3xl font-black text-[#8f0d15]">{authText.forgotTitle}</h2>
      <p className="mt-3 text-center text-sm text-gray-600">{authText.forgotDescription}</p>

      <form className="mt-8 flex flex-col gap-5">
        <label className="text-sm font-semibold text-gray-700">
          {authText.emailLabel}
          <input
            type="email"
            placeholder={authText.emailPlaceholder}
            className="mt-2 w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
          />
        </label>

        <LiquidGlassButton
          type="button"
          variant="gradient"
          className="mt-2 w-full rounded-[16px] py-3 text-lg font-black uppercase tracking-widest text-white"
        >
          {authText.sendResetButton.toUpperCase()}
        </LiquidGlassButton>
      </form>

      <p className="mt-7 text-center text-sm text-gray-700">
        {authText.backToLogin}{' '}
        <button
          type="button"
          className="font-semibold text-[#6e34c5]"
          onClick={() => onSwitchMode('login')}
        >
          {authText.loginLink}
        </button>
      </p>
    </div>
  )
}

export default ForgotPasswordPopup

