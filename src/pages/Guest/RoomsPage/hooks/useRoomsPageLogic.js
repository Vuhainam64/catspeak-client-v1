import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateVideoSessionMutation } from "@/store/api/videoSessionsApi"
import { useGetRoomsQuery } from "@/store/api/roomsApi"
import { slides } from "../constants"

export const useRoomsPageLogic = () => {
  const [active, setActive] = useState(0)
  const [allowConnect, setAllowConnect] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [tab, setTab] = useState("communicate")
  const [liveInput, setLiveInput] = useState("")
  const [userLetters, setUserLetters] = useState(2)
  const totalLetters = 220

  const navigate = useNavigate()
  const [createVideoSession, { isLoading: isCreating }] =
    useCreateVideoSessionMutation()
  const { data, isLoading: isLoadingRooms } = useGetRoomsQuery()
  const rooms = Array.isArray(data) ? data : []

  const handleCreateOneOnOneSession = async () => {
    try {
      const response = await createVideoSession({
        name: "Quick Chat",
        roomType: 1,
        invitedParticipants: [],
      }).unwrap()

      const sessionId = response.sessionId || response.id
      if (sessionId) {
        navigate(`/meet/${sessionId}`)
      }
    } catch (error) {
      console.error("Failed to create 1:1 session:", error)
    }
  }

  const handleCreateStudyGroupSession = async () => {
    try {
      const response = await createVideoSession({
        name: "Study Group",
        roomType: 2,
        requiredLevel: "Beginner",
      }).unwrap()

      const sessionId = response.sessionId || response.id
      if (sessionId) {
        navigate(`/meet/${sessionId}`)
      }
    } catch (error) {
      console.error("Failed to create study group session:", error)
    }
  }

  const current = useMemo(() => slides[active], [active])

  const totalPages = Math.max(1, Math.ceil(rooms.length / pageSize))
  const pagedRooms = useMemo(
    () => rooms.slice((page - 1) * pageSize, page * pageSize),
    [page, rooms, pageSize]
  )

  const handleSendLive = (msg) => {
    if (!msg?.trim()) return
    setUserLetters((n) => n + 1)
    setLiveInput("")
  }

  const next = () => setActive((p) => (p + 1) % slides.length)
  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length)

  return {
    state: {
      active,
      allowConnect,
      page,
      tab,
      liveInput,
      userLetters,
      totalLetters,
      isCreating,
      isLoadingRooms,
      rooms,
    },
    derived: {
      current,
      totalPages,
      pagedRooms,
    },
    actions: {
      setActive,
      setAllowConnect,
      setPage,
      setTab,
      setLiveInput,
      handleCreateOneOnOneSession,
      handleCreateStudyGroupSession,
      handleSendLive,
      next,
      prev,
    },
  }
}
