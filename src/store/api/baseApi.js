import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from state if available, otherwise check localStorage
    const token = getState()?.auth?.token || localStorage.getItem('token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Base API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'User'], // Define tag types for cache invalidation
  endpoints: () => ({}),
})

