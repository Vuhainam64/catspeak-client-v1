import React, { createContext, useContext, useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useGetProfileQuery } from "@/store/api/authApi"
import {
  useGetVideoSessionByIdQuery,
  useLeaveVideoSessionMutation,
  useJoinVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import { useVideoCall } from "@/hooks/useVideoCall"
import toast from "react-hot-toast"

const VideoCallContext = createContext()

export const useVideoCallContext = () => useContext(VideoCallContext)

export const VideoCallProvider = ({ children }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  const { data: userData, isLoading: isLoadingUser } = useGetProfileQuery()

  // Extract current user ID correctly from API response structure
  const user = userData?.data
  const currentUserId = user?.accountId

  const token = localStorage.getItem("token")

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, {
    skip: !id,
  })

  const [leaveSession, { isLoading: isLeaving }] =
    useLeaveVideoSessionMutation()
  const [joinSession] = useJoinVideoSessionMutation()

  // Ensure user joins the session via API when accessing directly (only after manual join)
  useEffect(() => {
    if (id && token && hasJoined) {
      joinSession(id)
        .unwrap()
        .catch((err) => {
          console.error("Failed to join session via API:", err)
        })
    }
  }, [id, token, joinSession, hasJoined])

  // Use Custom Hook for WebRTC logic
  const {
    connection,
    localStream,
    peers,
    participants: activeParticipants,
    messages,
    isConnected,
    toggleAudio,
    toggleVideo,
    sendMessage,
  } = useVideoCall(id, session?.participants, currentUserId, hasJoined)

  const handleToggleMic = () => {
    const newState = !micOn
    setMicOn(newState)
    toggleAudio(newState)
  }

  const handleToggleCam = () => {
    const newState = !cameraOn
    setCameraOn(newState)
    toggleVideo(newState)
  }

  const handleSendMessage = (text) => {
    sendMessage(text).catch((err) =>
      console.error("Failed to send message", err)
    )
  }

  const handleLeaveSession = async () => {
    try {
      await leaveSession(id).unwrap()
      navigate("/rooms")
    } catch (error) {
      console.error("Failed to leave session:", error)
      navigate("/rooms")
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
  }

  const value = {
    id,
    navigate,
    location,
    micOn,
    setMicOn,
    cameraOn,
    setCameraOn,
    showChat,
    setShowChat,
    showParticipants,
    setShowParticipants,
    hasJoined,
    setHasJoined,
    user,
    isLoadingUser,
    currentUserId,
    session,
    isLoadingSession,
    sessionError,
    isLeaving,
    connection,
    localStream,
    peers,
    activeParticipants,
    messages,
    isConnected,
    handleToggleMic,
    handleToggleCam,
    handleSendMessage,
    handleLeaveSession,
    handleCopyLink,
  }

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  )
}
