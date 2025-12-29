import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    // Get token from state if available, otherwise check localStorage
    const token = getState()?.auth?.token || localStorage.getItem("token")
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
    const refreshToken = api.getState().auth.refreshToken

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
            // Success! Store the new tokens
            // We need to import the action creator.
            // Since this file is imported by authSlice (indirectly via authApi... wait, circular dependency?)
            // authApi imports baseApi. baseApi uses baseQuery.
            // authSlice imports authApi.
            // So we cannot import setCredentials from authSlice here easily without circular dependency risk?
            // Actually authSlice import authApi which imports baseApi.
            // So importing authSlice here would create: baseApi -> authSlice -> authApi -> baseApi.
            // To avoid this, we can dispatch the action type manually or separate the types.
            // Or better, since we are in the API, we can use the 'setCredentials' action if we import it from a separate file?
            // No, setCredentials is in authSlice.

            // Workaround: We can dispatch an action object manually matching what authSlice expects.
            api.dispatch({
              type: "auth/setCredentials",
              payload: refreshResult.data,
            })

            // Retry the initial query
            result = await baseQuery(args, api, extraOptions)
          } else {
            // Refresh failed
            api.dispatch({ type: "auth/clearCredentials" })
          }
        } catch (err) {
          api.dispatch({ type: "auth/clearCredentials" })
        }
      }
    } else {
      // No refresh token available, logout
      api.dispatch({ type: "auth/clearCredentials" })
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
