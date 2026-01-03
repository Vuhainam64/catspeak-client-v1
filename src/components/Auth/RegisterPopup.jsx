import { useState } from 'react'
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi'
import { useLanguage } from '@context/LanguageContext.jsx'
import LiquidGlassButton from '@components/LiquidGlassButton'
import { useRegisterMutation } from '@/store/api/authApi'
import { useNavigate } from 'react-router-dom'

const RegisterPopup = ({ onClose, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useLanguage()
  const authText = t.auth
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dateOfBirth: ''
  })
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (!agreed) {
      newErrors.agreement = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await register(formData).unwrap()
      onClose()
      navigate('/')
    } catch (err) {
      console.error('Registration failed:', err)
      setErrors({ submit: err?.data?.message || 'Registration failed. Please try again.' })
    }
  }

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

      <h2 className="text-center text-3xl font-black text-[#8f0d15]">{authText.registerTitle}</h2>

      {errors.submit && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5">
        <label className="text-sm font-semibold text-gray-700">
          {authText.usernameLabel || 'Username'}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={authText.usernamePlaceholder || 'Enter your username'}
            className={`mt-2 w-full rounded-full border ${errors.username ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]`}
          />
          {errors.username && <span className="text-xs text-red-500 mt-1">{errors.username}</span>}
        </label>

        <label className="text-sm font-semibold text-gray-700">
          {authText.emailLabel}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={authText.emailPlaceholder}
            className={`mt-2 w-full rounded-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]`}
          />
          {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
        </label>

        <label className="text-sm font-semibold text-gray-700">
          {authText.passwordLabel}
          <div className={`mt-2 flex items-center rounded-full border ${errors.password ? 'border-red-500' : 'border-gray-200'} px-4 py-3`}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={authText.passwordPlaceholder}
              className="w-full text-sm text-gray-700 outline-none"
            />
            <button
              type="button"
              className="ml-2 text-lg text-gray-500 transition hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
        </label>

        <label className="text-sm font-semibold text-gray-700">
          {authText.dateOfBirthLabel || 'Date of Birth'}
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`mt-2 w-full rounded-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]`}
          />
          {errors.dateOfBirth && <span className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</span>}
        </label>

        <label className="flex items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[#f08d1d]"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
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
        {errors.agreement && <span className="text-xs text-red-500 -mt-3">{errors.agreement}</span>}

        <LiquidGlassButton
          type="submit"
          variant="gradient"
          className="mt-2 w-full rounded-[16px] py-3 text-lg font-black uppercase tracking-widest text-white"
          disabled={isLoading}
        >
          {isLoading ? 'ĐANG ĐĂNG KÝ...' : authText.registerButton.toUpperCase()}
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
        <button
          type="button"
          className="font-semibold text-[#6e34c5]"
          onClick={() => onSwitchMode('login')}
        >
          {authText.loginLink}
        </button>
      </div>
    </div>
  )
}

export default RegisterPopup

