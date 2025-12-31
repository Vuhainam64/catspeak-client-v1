import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    // Get token from state if available, otherwise check localStorage
    // Get token from state if available, otherwise check localStorage
    const token = localStorage.getItem("token")
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

// Mutex lock for refresh
let refreshPromise = null

// Custom base query with auto-refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Attempt to refresh logic
    const refreshToken = localStorage.getItem("refreshToken")

    if (!refreshToken) {
      // No refresh token available, logout
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      return result
    }

    // prevent infinite loops if the refresh endpoint itself returns 401
    if (args.url === "/Auth/refresh-token") {
      return result
    }

    // 1. If no refresh in progress, start one
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          // We use the baseQuery directly to avoid circular dependency
          const refreshResult = await baseQuery(
            {
              url: "/Auth/refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          )

          if (refreshResult.data) {
            const {
              token,
              refreshToken: newRefreshToken,
              user,
            } = refreshResult.data
            if (token) localStorage.setItem("token", token)
            // Some APIs rotate refresh tokens, some don't. Always safe to update if provided.
            if (newRefreshToken)
              localStorage.setItem("refreshToken", newRefreshToken)
            if (user) localStorage.setItem("user", JSON.stringify(user))
            return true
          } else {
            // Refresh failed (bad token, etc.)
            return false
          }
        } catch (err) {
          return false
        } finally {
          // Release lock
          refreshPromise = null
        }
      })()
    }

    // 2. Wait for the refresh (current or ongoing) to complete
    const success = await refreshPromise

    if (success) {
      // 3. Retry the original query
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Refresh failed -> Logout
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      // Optionally dispatch a logout action if needed, but clearing storage is usually enough for the guard to catch
    }
  }

  return result
}

// Base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "VideoSessions", "Rooms"], // Define tag types for cache invalidation
  endpoints: () => ({}),
})
