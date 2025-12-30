import React from "react"
import { Navigate, Outlet } from "react-router-dom"

const GuestGuard = ({ children }) => {
  const token = localStorage.getItem("token")

  if (token) {
    return <Navigate to="/app" replace />
  }

  return children || <Outlet />
}

export default GuestGuard
