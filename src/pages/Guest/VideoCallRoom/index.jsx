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
import { useSelector } from "react-redux"

import {
  useGetVideoSessionByIdQuery,
  useLeaveVideoSessionMutation,
  useJoinVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import { useVideoCall } from "@/hooks/useVideoCall"
import VideoGrid from "@/components/video-call/VideoGrid"
import ParticipantList from "@/components/video-call/ParticipantList"

const VideoCallRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [message, setMessage] = useState("")

  // Get current user and token
  const { user, token } = useSelector((state) => state.auth)

  // Redirect if not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, {
    skip: !id,
  })

  console.log("VideoCallRoom Session Status:", {
    id,
    isLoadingSession,
    sessionError,
    sessionData: session,
    participants: session?.participants,
  })

  const [leaveSession, { isLoading: isLeaving }] =
    useLeaveVideoSessionMutation()
  const [joinSession] = useJoinVideoSessionMutation()

  // Ensure user joins the session via API when accessing directly
  useEffect(() => {
    if (id && token) {
      joinSession(id)
        .unwrap()
        .catch((err) => {
          console.error("Failed to join session via API:", err)
          // If error implies session doesn't exist or closed, might want to redirect
        })
    }
  }, [id, token, joinSession])

  // Use Custom Hook for WebRTC logic
  const {
    connection,
    localStream,
    peers,
    participants: activeParticipants, // From SignalR events (real-time join/leave)
    toggleAudio,
    toggleVideo,
    sendMessage,
  } = useVideoCall(id, user, token, session?.participants)

  // Merge session participants with active streams
  // session.participants is the source of truth for "who is allowed/invited" or "who was in DB"
  // peers tells us who is actually continuously streaming to us
  const allParticipants = activeParticipants

  // Note: SignalR events might add people not yet in session.participants validation if API is slow
  // But for now relying on session.participants + peers logic in VideoGrid is safest for metadata.

  // Sync controls with hook
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

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
        .then(() => setMessage(""))
        .catch((err) => console.error("Failed to send message", err))
    }
  }

  const handleLeaveSession = async () => {
    console.log("handleLeaveSession triggered")
    try {
      await leaveSession(id).unwrap()
      console.log("Left session successfully via API")
      navigate("/rooms")
    } catch (error) {
      console.error("Failed to leave session:", error)
      navigate("/rooms")
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
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
          {/* Meeting ID */}
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
            participants={allParticipants}
            currentUserId={user?.id}
          />
        </div>

        {/* Side Panel (Chat or Participants) */}
        {(showChat || showParticipants) && (
          <div className="w-80 flex flex-col">
            {showParticipants && (
              <ParticipantList
                participants={allParticipants}
                peers={peers}
                currentUserId={user?.id}
              />
            )}

            {showChat && !showParticipants && (
              <div className="flex h-full flex-col border-l border-[#303134] bg-[#202124]">
                <div className="border-b border-[#303134] px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-100">
                    Room Message
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 text-center text-gray-500">
                  Chat disabled (WIP)
                </div>
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type Something..."
                      className="flex-1 rounded-lg border border-[#3c4043] bg-[#2a2a2b] px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-[#8ab4f8] focus:outline-none focus:ring-1 focus:ring-[#8ab4f8]"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8ab4f8] text-[#202124] transition hover:bg-[#a6c8ff]"
                    >
                      <FiSend className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
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
          <button
            onClick={handleToggleMic}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              micOn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {micOn ? (
              <FiMic className="h-5 w-5" />
            ) : (
              <FiMicOff className="h-5 w-5" />
            )}
          </button>

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

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
            <div className="h-3 w-3 rounded-full bg-white" />
          </button>

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
