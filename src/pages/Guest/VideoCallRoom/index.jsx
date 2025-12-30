import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom"
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiCircle,
  FiMessageCircle,
  FiMoreVertical,
  FiUsers,
  FiChevronRight,
  FiSend,
} from "react-icons/fi"
import toast from "react-hot-toast"
import { useGetProfileQuery } from "@/store/api/authApi"

import {
  useGetVideoSessionByIdQuery,
  useLeaveVideoSessionMutation,
  useJoinVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import { useVideoCall } from "@/hooks/useVideoCall"
import VideoGrid from "@/components/video-call/VideoGrid"
import ParticipantList from "@/components/video-call/ParticipantList"
import ChatBox from "@/components/video-call/ChatBox"
import MicButton from "@/components/video-call/MicButton"
import WaitingScreen from "@/components/video-call/WaitingScreen"

const VideoCallRoom = () => {
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

  // We can still read token for legacy usage if needed, or rely on internal logic.
  // For useVideoCall/joinSession, they might need a token string if they don't use the state directly.
  // Since we are authenticated if we pass the above check, the token in LS should be valid.
  const token = localStorage.getItem("token")

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, {
    skip: !id,
  })

  console.log(user)

  const [leaveSession, { isLoading: isLeaving }] =
    useLeaveVideoSessionMutation()
  const [joinSession] = useJoinVideoSessionMutation()

  // Ensure user joins the session via API when accessing directly
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

  // Let the API handle 401. If we have no user and not loading, it means we failed to auth.
  if (!isLoadingUser && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ... inside component ...

  if (!hasJoined) {
    return (
      <WaitingScreen
        session={session}
        localStream={localStream}
        micOn={micOn}
        cameraOn={cameraOn}
        user={user}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        onJoin={() => setHasJoined(true)}
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#1f1f1f] text-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#303134] bg-[#202124] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#990011] text-white font-bold">
            CA
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-100">
              Topic : {session?.topic || "General"}
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600 transition"
            title="Click to copy link"
          >
            <FiChevronRight className="h-4 w-4" />
            {id} (Copy Link)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex flex-1 flex-col bg-gradient-to-br from-[#2a1818] via-[#1f1f1f] to-[#141414]">
          <VideoGrid
            localStream={localStream}
            peers={peers}
            participants={activeParticipants}
            currentUserId={currentUserId}
          />
        </div>

        {/* Side Panel (Chat or Participants) */}
        {(showChat || showParticipants) && (
          <div className="w-80 flex flex-col">
            {showParticipants && (
              <ParticipantList
                participants={activeParticipants}
                peers={peers}
                currentUserId={currentUserId}
              />
            )}

            {showChat && !showParticipants && (
              <ChatBox
                messages={messages}
                currentUser={user}
                allParticipants={activeParticipants}
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
                className="w-80"
              />
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between border-t border-[#303134] bg-[#202124] px-6 py-4">
        <div className="text-lg font-semibold text-gray-200">
          {/* Timer could go here */}
        </div>

        <div className="flex items-center gap-3">
          <MicButton
            micOn={micOn}
            onToggle={handleToggleMic}
            stream={localStream}
            className="z-10"
          />

          <button
            onClick={handleToggleCam}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              cameraOn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {cameraOn ? (
              <FiVideo className="h-5 w-5" />
            ) : (
              <FiVideoOff className="h-5 w-5" />
            )}
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3c4043] text-white transition hover:bg-[#5f6368]">
            <FiMonitor className="h-5 w-5" />
          </button>

          {/* Participants Toggle */}
          <button
            onClick={() => {
              setShowParticipants(!showParticipants)
              setShowChat(false)
            }}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              showParticipants
                ? "bg-[#8ab4f8] text-[#202124]"
                : "bg-[#3c4043] text-white hover:bg-[#5f6368]"
            }`}
          >
            <FiUsers className="h-5 w-5" />
          </button>

          {/* <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
            <div className="h-3 w-3 rounded-full bg-white" />
          </button> */}

          <button
            onClick={() => {
              setShowChat(!showChat)
              setShowParticipants(false)
            }}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              showChat
                ? "bg-[#8ab4f8] text-[#202124]"
                : "bg-[#3c4043] text-white"
            }`}
          >
            <FiMessageCircle className="h-5 w-5" />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3c4043] text-white transition hover:bg-[#5f6368]">
            <FiMoreVertical className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={handleLeaveSession}
          disabled={isLeaving}
          className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-400"
        >
          {isLeaving ? "Leaving..." : "Leave Call"}
        </button>
      </div>
    </div>
  )
}

export default VideoCallRoom
