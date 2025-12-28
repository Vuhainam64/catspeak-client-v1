import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useLanguage } from '@context/LanguageContext.jsx'
import LiquidGlassButton from '@components/LiquidGlassButton'
import { useRegisterMutation } from '@/store/api/authApi'

const languages = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' },
  { label: '中文', value: 'cn' },
]

const countries = ['Việt Nam', 'United States', 'Singapore', 'Japan']

const RegisterPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useLanguage()
  const authText = t.auth

  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [language, setLanguage] = useState(languages[0].value)
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState(countries[0])

  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({
        fullName,
        email,
        phoneNumber: phone,
        language,
        password,
        country,
        // Add other fields as necessary based on API requirements
      }).unwrap()
      navigate('/app') // Or /login if email verification is needed
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
        
        <h2 className="text-center text-3xl font-black text-[#8f0d15]">{authText.registerTitle}</h2>

        <form className="mt-8 grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-700">
            {authText.fullNameLabel}
            <input
              type="text"
              placeholder={authText.fullNamePlaceholder}
              className="mt-2 w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            {authText.emailLabel}
            <input
              type="email"
              placeholder={authText.emailPlaceholder}
              className="mt-2 w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-gray-700">
              {authText.phoneLabel}
              <input
                type="tel"
                placeholder={authText.phonePlaceholder}
                className="mt-2 w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label className="text-sm font-semibold text-gray-700">
              {authText.languageLabel}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-gray-700">
              {authText.passwordLabel}
              <div className="mt-2 flex items-center rounded-full border border-gray-200 px-4 py-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={authText.passwordPlaceholder}
                  className="w-full text-sm text-gray-700 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-lg text-gray-500 transition hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </label>

            <label className="text-sm font-semibold text-gray-700">
              {authText.countryLabel}
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[#f08d1d]" />
            <span>
              {authText.agreePrefix}{' '}
              <button type="button" className="font-semibold text-[#6e34c5]">
                {authText.serviceTerms}
              </button>{' '}
              {authText.and}{' '}
              <button type="button" className="font-semibold text-[#6e34c5]">
                {authText.privacyPolicy}
              </button>{' '}
              {authText.companySuffix}
            </span>
          </label>

          <LiquidGlassButton
            type="submit"
            variant="gradient"
            className="mt-2 w-full rounded-[16px] py-3 text-lg font-black uppercase tracking-widest text-white disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '...' : authText.registerButton.toUpperCase()}
          </LiquidGlassButton>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <div className="relative mb-4">
            <span className="relative z-10 bg-white px-4 font-semibold text-gray-500">
              {authText.or}
            </span>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gray-200" />
          </div>
          {authText.haveAccount}{' '}
          <Link
            to="/login"
            className="font-semibold text-[#6e34c5]"
          >
            {authText.loginLink}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
