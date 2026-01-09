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
import { MeetingProvider } from "@videosdk.live/react-sdk"
import { meetingConfig } from "@/utils/videoSdkConfig"
import useAuth from "@/hooks/useAuth"

const VideoCallContext = createContext()

export const useVideoCallContext = () => useContext(VideoCallContext)

// Internal component that has access to MeetingContext
const VideoCallContent = ({
  children,
  session,
  joinSession,
  leaveSession,
  sessionError,
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Local UI state
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [hasJoined, setHasJoined] = useState(false) // Controls the "Join" screen of UI
  const [videoTrack, setVideoTrack] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)

  // -- Preview Stream Logic --

  // Video Track Management
  useEffect(() => {
    if (hasJoined) {
      setVideoTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
      return
    }

    let active = true
    let newTrack = null

    const updateVideo = async () => {
      if (cameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          newTrack = stream.getVideoTracks()[0]
          if (active) setVideoTrack(newTrack)
          else newTrack.stop()
        } catch (err) {
          console.error("Error getting video:", err)
        }
      } else {
        setVideoTrack(null)
      }
    }

    updateVideo()

    return () => {
      active = false
      if (newTrack) newTrack.stop()
      setVideoTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
    }
  }, [hasJoined, cameraOn])

  // Audio Track Management (Similar logic)
  useEffect(() => {
    if (hasJoined) {
      setAudioTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
      return
    }

    let active = true
    let newTrack = null

    const updateAudio = async () => {
      if (micOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
          newTrack = stream.getAudioTracks()[0]
          if (active) setAudioTrack(newTrack)
          else newTrack.stop()
        } catch (err) {
          console.error("Error getting audio:", err)
        }
      } else {
        setAudioTrack(null)
      }
    }

    updateAudio()

    return () => {
      active = false
      if (newTrack) newTrack.stop()
      setAudioTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
    }
  }, [hasJoined, micOn])

  // Combine tracks into stream
  const [previewStream, setPreviewStream] = useState(null)
  useEffect(() => {
    const tracks = []
    if (videoTrack) tracks.push(videoTrack)
    if (audioTrack) tracks.push(audioTrack)

    if (tracks.length > 0) {
      setPreviewStream(new MediaStream(tracks))
    } else {
      setPreviewStream(null)
    }
  }, [videoTrack, audioTrack])

  const { data: userData } = useGetProfileQuery()
  const user = userData?.data
  const currentUserId = user?.accountId

  // Use the refactored hook which now uses VideoSDK hooks internally
  const {
    participants,
    messages,
    toggleAudio,
    toggleVideo,
    sendMessage,
    leaveMeeting,
    isConnected,
    localParticipant,
    localMediaStream, // Added
  } = useVideoCall(hasJoined)

  // Sync local UI toggles with hook actions
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
    sendMessage(text)
  }

  const handleLeaveSession = async () => {
    // 1. Notify backend
    if (id) {
      try {
        await leaveSession(id).unwrap()
      } catch (error) {
        console.error("Failed to leave session api:", error)
      }
    }
    // 2. Leave VideoSDK meeting
    leaveMeeting()

    navigate("/rooms")
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
  }

  // Backend Join Sync
  const { token } = useAuth()
  useEffect(() => {
    if (id && token && hasJoined && session && currentUserId) {
      // Check if already in participants list to prevent double-join or unnecessary API calls
      const isAlreadyParticipant = session.participants?.some(
        (p) => String(p.accountId) === String(currentUserId)
      )

      if (isAlreadyParticipant) {
        console.log(
          "[VideoCallContext] User already in session participants, skipping API join."
        )
        return
      }

      joinSession(id)
        .unwrap()
        .then(() => {
          toast.success("Joined session successfully")
        })
        .catch((err) => {
          console.error("Failed to join session via API:", err)
          if (err?.status === 400) {
            const msg = err?.data || "Failed to join session"
            // Only toast if it's a real error, capacity, etc.
            if (String(msg).toLowerCase().includes("capacity")) {
              toast.error(msg)
              // Optional: Redirect could go here
            } else {
              // Suppress or show generic "Already joined?"
              console.warn("Join API failed (likely already joined):", msg)
            }
          }
        })
    }
  }, [id, token, hasJoined, session, currentUserId, joinSession])

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
    currentUserId,
    session,
    sessionError,

    // Normalized Data
    activeParticipants: participants,
    messages,
    isConnected,
    localStream: hasJoined ? localMediaStream : previewStream, // Now a proper MediaStream (preview or live)

    // Actions
    handleToggleMic,
    handleToggleCam,
    handleSendMessage,
    handleLeaveSession,
    handleCopyLink,

    // Additional
    connection: null, // Legacy support if needed
    peers: {}, // Legacy support
  }

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  )
}

export const VideoCallProvider = ({ children }) => {
  const { id } = useParams()
  const { data: userData } = useGetProfileQuery()
  const user = userData?.data

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, { skip: !id })

  const [joinSession] = useJoinVideoSessionMutation()
  const [leaveSession] = useLeaveVideoSessionMutation()

  // Loading state
  if (isLoadingSession || !userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>Loading Session...</p>
      </div>
    )
  }

  // Render Provider
  return (
    <MeetingProvider
      config={{
        meetingId: session?.videoSdkMeetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: user?.username || "Guest",
        metaData: {
          accountId: user?.accountId,
          username: user?.username,
        },
      }}
      token={session?.videoSdkToken}
      joinWithoutUserInteraction={false}
    >
      <VideoCallContent
        session={session}
        joinSession={joinSession}
        leaveSession={leaveSession}
        sessionError={sessionError}
      >
        {children}
      </VideoCallContent>
    </MeetingProvider>
  )
}
