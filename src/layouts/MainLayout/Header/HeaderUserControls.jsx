import React, { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FiBell, FiUser, FiSettings, FiLogOut, FiMail } from "react-icons/fi"
import { Spin } from "antd"
import { useGetProfileQuery } from "@/store/api/authApi"

import useAuth from "@/hooks/useAuth"

const HeaderUserControls = () => {
  const navigate = useNavigate()
  // Use useAuth for logout actions and user data access if available (though profile query is still used for details)
  const { logout, user: authUser } = useAuth()
  const { data: userData, isLoading } = useGetProfileQuery()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const user = userData?.data ?? authUser ?? {}

  const handleLogout = () => {
    console.log("=== LOGOUT CLICKED ===")
    logout()
    setIsOpen(false)
    navigate("/")
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex items-center gap-4" ref={dropdownRef}>
      {/* Notification Bell */}
      <button className="relative hidden lg:flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-[#f5c34a] to-[#c2131a] shadow-lg hover:shadow-xl transition-shadow">
        <FiBell className="h-5 w-5 text-white" />
      </button>

      {/* Avatar / Profile Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center rounded-full hover:shadow-xl transition cursor-pointer ${
            isOpen ? "ring-4 ring-[#f5c34a]/30 scale-105" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full overflow-hidden shadow-lg ${
                user?.avatarImageUrl
                  ? "bg-gray-100"
                  : "bg-gradient-to-b from-[#f5c34a] to-[#c2131a]"
              }`}
            >
              {user?.avatarImageUrl ? (
                <img
                  src={user?.avatarImageUrl}
                  alt={user?.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser className="h-5 w-5 text-white" />
              )}
            </div>
          )}
        </button>

        {/* Custom Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 origin-top-right rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 mb-1">
              {isLoading ? (
                <div className="flex justify-center py-2">
                  <Spin size="small" />
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-gray-900 truncate mb-1">
                    {user?.username}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FiMail className="shrink-0 text-[#f08d1d]" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <button
              onClick={() => {
                setIsOpen(false)
                navigate("/app/setting")
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fff7ed] hover:text-[#ea580c] transition-colors"
            >
              <FiSettings className="w-4 h-4" />
              Settings
            </button>

            <div className="my-1 border-t border-gray-100" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderUserControls
