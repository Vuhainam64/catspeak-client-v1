import { baseApi } from "./baseApi"
import { setCredentials, logout } from "../slices/authSlice"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Auth/login",
        method: "POST",
        body: credentials,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (err) {
          console.error(err)
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/Auth/register",
        method: "POST",
        body: userData,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (err) {
          console.error(err)
        }
      },
    }),
    registerAdmin: builder.mutation({
      query: (userData) => ({
        url: "/Auth/register-admin",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: builder.mutation({
      query: (tokenData) => ({
        url: "/Auth/refresh-token",
        method: "POST",
        body: tokenData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled
          const { user } = getState().auth
          // Preserve existing user if not returned by refresh
          dispatch(
            setCredentials({
              ...data,
              user: data.user || user,
            })
          )
        } catch (err) {
          console.error(err)
        }
      },
    }),
    revoke: builder.mutation({
      query: (username) => ({
        url: `/Auth/revoke/${username}`,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/Auth/logout",
        method: "POST",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logout())
        } catch (err) {
          console.error(err)
        }
      },
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/Account/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterAdminMutation,
  useRefreshTokenMutation,
  useRevokeMutation,

  useLogoutMutation,
  useGetProfileQuery,
} = authApi
