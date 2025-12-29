import { FiMicOff } from "react-icons/fi"
import useAudioLevel from "@/hooks/useAudioLevel"
import { useEffect, useRef } from "react"

const VideoTile = ({ stream, name, avatar, isLocal, micOn = true }) => {
  const audioLevel = useAudioLevel(stream)
  const isSpeaking = micOn && audioLevel > 5
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (!stream) return

    console.log(`[VideoTile] ${name || "unknown"} stream`, {
      audioTracks: stream.getAudioTracks().length,
      videoTracks: stream.getVideoTracks().length,
      audioEnabled: stream.getAudioTracks().map((t) => t.enabled),
      videoEnabled: stream.getVideoTracks().map((t) => t.enabled),
    })
  }, [stream, name])

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-lg bg-gray-900 border transition-all duration-200 ${
        isSpeaking
          ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          : "border-gray-800"
      }`}
    >
      {stream ? (
        <video
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent feedback
          ref={videoRef}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-800">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className={`h-24 w-24 rounded-full border-4 object-cover transition-colors duration-200 ${
                isSpeaking ? "border-green-500" : "border-gray-700"
              }`}
              onError={(e) => {
                e.target.style.display = "none"
              }} // Hide if fails
            />
          ) : (
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 border-4 text-2xl font-bold text-gray-300 transition-colors duration-200 ${
                isSpeaking ? "border-green-500" : "border-gray-600"
              }`}
            >
              {(name || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1">
        <span className="text-sm font-medium text-white flex items-center gap-2">
          {name} {isLocal && "(You)"}
          {isSpeaking && (
            <div className="flex gap-0.5 items-end h-3">
              <div
                className="w-1 bg-green-500 animate-pulse h-2 rounded-full"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1 bg-green-500 animate-pulse h-3 rounded-full"
                style={{ animationDelay: "100ms" }}
              />
              <div
                className="w-1 bg-green-500 animate-pulse h-1.5 rounded-full"
                style={{ animationDelay: "200ms" }}
              />
            </div>
          )}
        </span>
      </div>

      {/* Status Icons */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        {!micOn && (
          <div className="rounded-full bg-red-510/90 p-1.5 backdrop-blur-sm">
            <FiMicOff className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoTile
