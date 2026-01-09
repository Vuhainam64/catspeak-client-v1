import { createSlice } from "@reduxjs/toolkit"

// Helper to safely parse user from localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  } catch (e) {
    return null
  }
}

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken
      state.status = "succeeded"

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.status = "idle"

      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    },
    setLoading: (state) => {
      state.status = "loading"
    },
    setError: (state) => {
      state.status = "failed"
    },
  },
})

export const { setCredentials, logout, setLoading, setError } =
  authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => !!state.auth.token
export const selectAuthStatus = (state) => state.auth.status
export const selectUserRole = (state) => state.auth.user?.roleName || "Guest"
