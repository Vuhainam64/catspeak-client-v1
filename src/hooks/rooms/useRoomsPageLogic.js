import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateVideoSessionMutation } from "@/store/api/videoSessionsApi"
import { useGetRoomsQuery } from "@/store/api/roomsApi"
import { useLanguage } from "@/context/LanguageContext"

export const useRoomsPageLogic = () => {
  const { t } = useLanguage()
  // Ensure we have slides from translation, fallback if structure missing to avoid crash
  const slides = t?.rooms?.heroCarousel?.slides || []

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

  // Pass pagination params to the query
  const { data: responseData, isLoading: isLoadingRooms } = useGetRoomsQuery({
    page,
    pageSize,
  })

  // Extract rooms and pagination data safely
  const rooms = Array.isArray(responseData?.data) ? responseData.data : []
  const additionalData = responseData?.additionalData || {}
  const totalCount = additionalData.totalCount || 0

  // Note: API returns totalPages, but we can also calculate it or just use it.
  // The API response says "totalPages": 8.
  const apiTotalPages = additionalData.totalPages || 0

  // Separate loading states
  const [isCreatingOneOnOne, setIsCreatingOneOnOne] = useState(false)
  const [isCreatingStudyGroup, setIsCreatingStudyGroup] = useState(false)

  const handleCreateOneOnOneSession = () => {
    navigate("/queue")
  }

  const handleCreateStudyGroupSession = async () => {
    if (isCreatingStudyGroup) return
    setIsCreatingStudyGroup(true)
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
    } finally {
      setIsCreatingStudyGroup(false)
    }
  }

  const current = useMemo(() => slides[active] || {}, [active, slides])

  // Total pages now comes from API or calculated from totalCount if needed.
  // Using Math.max(1, ...) ensures at least 1 page.
  const totalPages = Math.max(1, apiTotalPages)

  // Rooms are already paged by the API, so we just return them.
  const pagedRooms = rooms

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
      isCreating: isCreating || isCreatingOneOnOne || isCreatingStudyGroup, // Backward compatibility or global loading
      isCreatingOneOnOne,
      isCreatingStudyGroup,
      isLoadingRooms,
      rooms, // This is the current page's rooms
    },
    derived: {
      current,
      totalPages,
      pagedRooms,
      slides, // Export slides so UI components can use the same translated list
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
