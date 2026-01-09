import React from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "@hooks/useAuth"

const AuthGuard = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // User is authorized but role is not allowed
    return <Navigate to="/403" replace />
  }

  return children || <Outlet />
}

export default AuthGuard
