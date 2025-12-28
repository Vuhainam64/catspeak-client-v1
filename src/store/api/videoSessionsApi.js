import { baseApi } from "./baseApi"

export const videoSessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveVideoSessions: builder.query({
      query: () => "/video-sessions/active",
      providesTags: ["VideoSessions"],
    }),
    getVideoSessionById: builder.query({
      query: (id) => `/video-sessions/${id}`,
      providesTags: (result, error, id) => [{ type: "VideoSessions", id }],
    }),
    createVideoSession: builder.mutation({
      query: (body) => ({
        url: "/video-sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["VideoSessions"],
    }),
    joinVideoSession: builder.mutation({
      query: (id) => ({
        url: `/video-sessions/${id}/participants`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "VideoSessions", id }],
    }),
    leaveVideoSession: builder.mutation({
      query: (id) => ({
        url: `/video-sessions/${id}/participants`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "VideoSessions", id }],
    }),
    endVideoSession: builder.mutation({
      query: (id) => ({
        url: `/video-sessions/${id}/end`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "VideoSessions", id }],
    }),
  }),
})

export const {
  useGetActiveVideoSessionsQuery,
  useGetVideoSessionByIdQuery,
  useCreateVideoSessionMutation,
  useJoinVideoSessionMutation,
  useLeaveVideoSessionMutation,
  useEndVideoSessionMutation,
} = videoSessionsApi
