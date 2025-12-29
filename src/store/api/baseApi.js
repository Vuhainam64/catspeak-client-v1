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

// Custom base query with auto-refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Attempt to refresh logic
    const refreshToken = localStorage.getItem("refreshToken")

    if (refreshToken) {
      // prevent infinite loops if the refresh endpoint itself returns 401
      if (args.url !== "/Auth/refresh-token") {
        try {
          // We use the baseQuery directly to avoid circular dependency or dispatching unwanted actions manually
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
            const { token, refreshToken, user } = refreshResult.data
            if (token) localStorage.setItem("token", token)
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
            if (user) localStorage.setItem("user", JSON.stringify(user))

            // Retry the initial query
            result = await baseQuery(args, api, extraOptions)
          } else {
            // Refresh failed
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")
          }
        } catch (err) {
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("user")
        }
      }
    } else {
      // No refresh token available, logout
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
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
