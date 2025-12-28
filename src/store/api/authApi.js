import { baseApi } from './baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/Auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    registerAdmin: builder.mutation({
      query: (userData) => ({
        url: '/Auth/register-admin',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation({
      query: (tokenData) => ({
        url: '/Auth/refresh-token',
        method: 'POST',
        body: tokenData,
      }),
    }),
    revoke: builder.mutation({
      query: (username) => ({
        url: `/Auth/revoke/${username}`,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    validateToken: builder.query({
      query: (tokenData) => ({
        url: '/Auth/validate-token',
        method: 'POST',
        body: tokenData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/Auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterAdminMutation,
  useRefreshTokenMutation,
  useRevokeMutation,
  useValidateTokenQuery,
  useLogoutMutation,
} = authApi
