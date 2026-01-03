import { baseApi } from "./baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.token) localStorage.setItem("token", data.token)
          if (data.refreshToken)
            localStorage.setItem("refreshToken", data.refreshToken)
          if (data.user) localStorage.setItem("user", JSON.stringify(data.user))
        } catch (err) { }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/Auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.token) localStorage.setItem("token", data.token)
          if (data.refreshToken)
            localStorage.setItem("refreshToken", data.refreshToken)
          if (data.user) localStorage.setItem("user", JSON.stringify(data.user))
        } catch (err) { }
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
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.token) localStorage.setItem("token", data.token)
          if (data.refreshToken)
            localStorage.setItem("refreshToken", data.refreshToken)
        } catch (err) { }
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
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("user")
        } catch (err) { }
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
