import React from "react"
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi"

const WaitingScreen = ({
  session,
  localStream,
  micOn,
  cameraOn,
  user,
  onToggleMic,
  onToggleCam,
  onJoin,
}) => {
  const participants = session?.participants || []

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-textColor font-sans">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-semibold text-headingColor">
          {session?.name || session?.roomName || "Ready to join?"}
        </h1>

        {/* Participant List */}
        {participants.length > 0 ? (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex -space-x-4">
              {participants.slice(0, 5).map((p) => (
                <div key={p.participantId} className="relative group">
                  <img
                    src={
                      p.avatarImageUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        p.username
                      )}&background=random`
                    }
                    alt={p.username}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                    title={p.username}
                  />
                </div>
              ))}
              {participants.length > 5 && (
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500 shadow-sm">
                  +{participants.length - 5}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {participants.length} is here
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No one else is here yet</p>
        )}
      </div>

      <div className="relative mb-8 h-[400px] w-[700px] overflow-hidden rounded-xl bg-white shadow-xl border border-gray-200">
        {/* Video Preview */}
        {localStream && (
          <video
            ref={(video) => {
              if (video) {
                video.srcObject = localStream
                if (micOn) video.muted = true // Mute local preview to prevent echo
              }
            }}
            autoPlay
            playsInline
            muted // Always mute local video preview purely for UI
            className={`h-full w-full object-cover ${
              !cameraOn ? "hidden" : ""
            }`}
            style={{ transform: "scaleX(-1)" }} // Mirror effect
          />
        )}

        {!cameraOn && (
          <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-bold text-cath-red-600 shadow-md border border-gray-100">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform items-center gap-6">
          <button
            onClick={onToggleMic}
            className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition duration-200 ${
              micOn
                ? "border-transparent bg-cath-red-600 text-white hover:bg-cath-red-700"
                : "border-gray-200 bg-white text-cath-red-400 hover:bg-gray-50"
            }`}
          >
            {micOn ? (
              <FiMic className="h-6 w-6" />
            ) : (
              <FiMicOff className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={onToggleCam}
            className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition duration-200 ${
              cameraOn
                ? "border-transparent bg-cath-red-600 text-white hover:bg-cath-red-700"
                : "border-gray-200 bg-white text-cath-red-400 hover:bg-gray-50"
            }`}
          >
            {cameraOn ? (
              <FiVideo className="h-6 w-6" />
            ) : (
              <FiVideoOff className="h-6 w-6" />
            )}
          </button>
        </div>

        {!micOn && (
          <div className="absolute top-4 right-4 rounded-md bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-md shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-cath-red-500">
              <FiMicOff className="h-4 w-4" />
              Mic Off
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onJoin}
          className="rounded-full bg-cath-orange-500 px-12 py-3 text-lg font-bold text-white shadow-lg transition duration-200 hover:bg-cath-orange-600 hover:shadow-orange-500/20 active:scale-95"
        >
          Join now
        </button>
        <div className="text-sm text-gray-500">
          joined as{" "}
          <span className="text-headingColor font-medium">
            {user?.username}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WaitingScreen
