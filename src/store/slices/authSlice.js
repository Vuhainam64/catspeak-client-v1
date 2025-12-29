import { createSlice } from "@reduxjs/toolkit"
import { authApi } from "../api/authApi"

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload
      state.user = user
      state.token = token
      // Only update refreshToken if it's provided, otherwise keep existing
      if (refreshToken) {
        state.refreshToken = refreshToken
        localStorage.setItem("refreshToken", refreshToken)
      }
      state.isAuthenticated = true
      if (token) {
        localStorage.setItem("token", token)
      }
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Handle login mutation
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token)
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken)
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error?.data?.message || "Login failed"
        state.isAuthenticated = false
      })

    // Handle register mutation
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isLoading = false
          state.user = action.payload.user
          state.token = action.payload.token
          state.refreshToken = action.payload.refreshToken
          state.isAuthenticated = true
          if (action.payload.token) {
            localStorage.setItem("token", action.payload.token)
          }
          if (action.payload.refreshToken) {
            localStorage.setItem("refreshToken", action.payload.refreshToken)
          }
        }
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error?.data?.message || "Registration failed"
      })

    // Handle logout mutation
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    })
  },
})

export const { setCredentials, clearCredentials, setError, clearError } =
  authSlice.actions
export default authSlice.reducer
