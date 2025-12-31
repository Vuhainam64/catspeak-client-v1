import { baseApi } from "./baseApi"

export const queueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    joinQueue: builder.mutation({
      query: () => ({
        url: "/queue/join",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    leaveQueue: builder.mutation({
      query: () => ({
        url: "/queue/leave",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getQueueStatus: builder.query({
      query: () => "/queue/status",
    }),
    getQueueStats: builder.query({
      query: () => "/queue/stats",
    }),
  }),
})

export const {
  useJoinQueueMutation,
  useLeaveQueueMutation,
  useGetQueueStatusQuery,
  useGetQueueStatsQuery,
} = queueApi
