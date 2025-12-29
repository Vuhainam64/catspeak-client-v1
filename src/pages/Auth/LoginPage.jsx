import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useLanguage } from "@context/LanguageContext.jsx"
import LiquidGlassButton from "@components/LiquidGlassButton"
import { useLoginMutation } from "@/store/api/authApi"

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { t } = useLanguage()
  const authText = t.auth

  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ username: email, password }).unwrap()
      const from = location.state?.from?.pathname || "/app"
      navigate(from, { replace: true }) // Redirect to origin or app dashboard
    } catch (err) {
      console.error("Login failed:", err)
      // Ideally show error to user here
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
        <h2 className="text-center text-3xl font-black text-[#8f0d15]">
          {authText.loginTitle}
        </h2>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-gray-700">
            {authText.emailLabel}
            <input
              type="text"
              placeholder={authText.emailPlaceholder}
              className="mt-2 w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f08d1d] focus:ring-1 focus:ring-[#f08d1d]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="text-sm font-semibold text-gray-700">
            {authText.passwordLabel}
            <div className="mt-2 flex items-center rounded-full border border-gray-200 px-4 py-3">
              <input
                type={showPassword ? "text" : "password"}
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

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-[#f08d1d]" />
              {authText.rememberMe}
            </label>
            <Link
              to="/forgot-password"
              className="font-semibold text-[#6e34c5]"
            >
              {authText.forgotLink}
            </Link>
          </div>

          <LiquidGlassButton
            type="submit"
            variant="gradient"
            className="mt-2 w-full rounded-[16px] py-3 text-lg font-black uppercase tracking-widest text-white disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "..." : authText.loginButton.toUpperCase()}
          </LiquidGlassButton>
        </form>

        <p className="mt-7 text-center text-sm text-gray-700">
          {authText.dontHaveAccount}{" "}
          <Link to="/register" className="font-semibold text-[#6e34c5]">
            {authText.registerLink}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
