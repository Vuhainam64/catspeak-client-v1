import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logout } from "../slices/authSlice"

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    // Get token from state if available, otherwise check localStorage
    // Get token from state if available, otherwise check localStorage
    const token = getState().auth.token
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
    const refreshToken = api.getState().auth.refreshToken
    const token = api.getState().auth.token

    if (!refreshToken || !token) {
      api.dispatch(logout())
      return result
    }

    // prevent infinite loops if the refresh endpoint itself returns 401
    if (args.url === "/Auth/refresh-token") {
      return result
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/Auth/refresh-token",
              method: "POST",
              body: { token, refreshToken },
            },
            api,
            extraOptions
          )

          if (refreshResult.data) {
            const { user } = api.getState().auth
            api.dispatch(
              setCredentials({
                ...refreshResult.data,
                user: refreshResult.data.user || user,
              })
            )
            return true
          }
          return false
        } catch (err) {
          return false
        } finally {
          refreshPromise = null
        }
      })()
    }

    const success = await refreshPromise

    if (success) {
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

// Base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User", "VideoSessions", "Rooms", "Stories", "MyStories"], // Define tag types for cache invalidation
  endpoints: () => ({}),
})
