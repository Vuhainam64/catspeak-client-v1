import React from "react"
import { Navigate } from "react-router-dom"
import {
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiMessageCircle,
  FiMoreVertical,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi"

import VideoGrid from "@/components/video-call/VideoGrid"
import ParticipantList from "@/components/video-call/ParticipantList"
import ChatBox from "@/components/video-call/ChatBox"
import MicButton from "@/components/video-call/MicButton"
import WaitingScreen from "@/components/video-call/WaitingScreen"
import {
  VideoCallProvider,
  useVideoCallContext,
} from "@/context/VideoCallContext"

const VideoCallRoomContent = () => {
  const {
    id,
    location,
    micOn,
    cameraOn,
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
    isLeaving,
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
  } = useVideoCallContext()

  // Unread Messages Logic
  const [unreadMessages, setUnreadMessages] = React.useState(0)
  const prevMessagesLength = React.useRef(messages.length)

  React.useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (!showChat) {
        // Count new messages not from me
        let newUnread = 0
        for (let i = prevMessagesLength.current; i < messages.length; i++) {
          if (String(messages[i].senderId) !== String(currentUserId)) {
            newUnread++
          }
        }
        setUnreadMessages((prev) => prev + newUnread)
      }
    }
    prevMessagesLength.current = messages.length
  }, [messages, showChat, currentUserId])

  React.useEffect(() => {
    if (showChat) {
      setUnreadMessages(0)
    }
  }, [showChat])

  // Let the API handle 401. If we have no user and not loading, it means we failed to auth.
  if (!isLoadingUser && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

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
    <div className="flex h-full w-full flex-col bg-primary2 text-textColor font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cath-red-700 text-white font-bold shadow-md">
            CA
          </div>
          <div>
            <div className="text-sm font-semibold text-headingColor">
              Topic : {session?.topic || "General"}
            </div>
            <div className="text-xs text-lighttextGray">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-lg bg-cath-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cath-orange-600 transition shadow-sm"
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
        <div className="relative flex flex-1 flex-col bg-gradient-to-br from-primary2 via-white to-primary2">
          <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-[0.03] pointer-events-none" />
          <VideoGrid
            localStream={localStream}
            peers={peers}
            participants={activeParticipants}
            currentUserId={currentUserId}
          />
        </div>

        {/* Side Panel (Chat or Participants) */}
        {(showChat || showParticipants) && (
          <div className="w-80 flex flex-col border-l border-gray-200 bg-white">
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
                className="w-full h-full"
              />
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-lg font-semibold text-headingColor w-32">
          {/* Timer Placeholder */}
        </div>

        <div className="flex items-center gap-4">
          <MicButton
            micOn={micOn}
            onToggle={handleToggleMic}
            stream={localStream}
            className="z-10"
          />

          <button
            onClick={handleToggleCam}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition shadow-md border ${
              cameraOn
                ? "bg-cath-red-600 text-white border-transparent hover:bg-cath-red-700"
                : "bg-white text-cath-red-400 border-gray-200 hover:bg-primary2"
            }`}
          >
            {cameraOn ? (
              <FiVideo className="h-5 w-5" />
            ) : (
              <FiVideoOff className="h-5 w-5" />
            )}
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 border border-gray-200 transition hover:bg-primary2 hover:text-headingColor shadow-sm">
            <FiMonitor className="h-5 w-5" />
          </button>

          <div className="h-8 w-px bg-gray-200 mx-2" />

          {/* Participants Toggle */}
          <button
            onClick={() => {
              setShowParticipants(!showParticipants)
              setShowChat(false)
            }}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition shadow-md border ${
              showParticipants
                ? "bg-cath-orange-500 text-white border-transparent"
                : "bg-white text-gray-500 border-gray-200 hover:bg-primary2 hover:text-headingColor"
            }`}
          >
            <FiUsers className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setShowChat(!showChat)
              setShowParticipants(false)
            }}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition shadow-md border relative ${
              showChat
                ? "bg-cath-orange-500 text-white border-transparent"
                : "bg-white text-gray-500 border-gray-200 hover:bg-primary2 hover:text-headingColor"
            }`}
          >
            <FiMessageCircle className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-bounce">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </span>
            )}
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 border border-gray-200 transition hover:bg-primary2 hover:text-headingColor shadow-sm">
            <FiMoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-end w-32">
          <button
            onClick={handleLeaveSession}
            disabled={isLeaving}
            className="rounded-full bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100 hover:ring-red-300 disabled:opacity-50"
          >
            {isLeaving ? "Leaving..." : "Leave"}
          </button>
        </div>
      </div>
    </div>
  )
}

const VideoCallRoom = () => {
  return (
    <VideoCallProvider>
      <VideoCallRoomContent />
    </VideoCallProvider>
  )
}

export default VideoCallRoom
