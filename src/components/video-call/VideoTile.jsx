import { FiMicOff, FiVideoOff } from "react-icons/fi"
import useAudioLevel from "@/hooks/useAudioLevel"
import { useEffect, useRef } from "react"

const VideoTile = ({
  stream,
  name,
  avatar,
  isLocal,
  micOn = true,
  videoOn = true,
}) => {
  const audioLevel = useAudioLevel(stream)
  const isSpeaking = micOn && audioLevel > 5
  const videoRef = useRef(null)

  useEffect(() => {
    // Assign stream if ref exists and stream exists (regardless of videoOn)
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream]) // Removed videoOn dependency to avoid re-assigning unnecessarily

  useEffect(() => {
    if (!stream) return
  }, [stream, name])

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-lg bg-white border shadow-sm transition-all duration-200 ${
        isSpeaking
          ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          : "border-gray-200"
      }`}
    >
      {/* Always render video if stream exists to ensure audio plays, hide if videoOn is false */}
      {stream && (
        <video
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent feedback
          ref={videoRef}
          className={`h-full w-full object-cover ${videoOn ? "" : "hidden"}`}
        />
      )}

      {/* Show Avatar if no stream OR video is off */}
      {(!stream || !videoOn) && (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className={`h-24 w-24 rounded-full border-4 object-cover transition-colors duration-200 ${
                isSpeaking ? "border-emerald-500" : "border-gray-200"
              }`}
              onError={(e) => {
                e.target.style.display = "none"
              }} // Hide if fails
            />
          ) : (
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 border-4 text-2xl font-bold text-gray-400 transition-colors duration-200 ${
                isSpeaking ? "border-emerald-500" : "border-gray-300"
              }`}
            >
              {(name || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-white/90 px-2 py-1 shadow-sm border border-gray-100">
        <span className="text-sm font-medium text-headingColor flex items-center gap-2">
          {name} {isLocal && "(You)"}
          {isSpeaking && (
            <div className="flex gap-0.5 items-end h-3">
              <div
                className="w-1 bg-emerald-500 animate-pulse h-2 rounded-full"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1 bg-emerald-500 animate-pulse h-3 rounded-full"
                style={{ animationDelay: "100ms" }}
              />
              <div
                className="w-1 bg-emerald-500 animate-pulse h-1.5 rounded-full"
                style={{ animationDelay: "200ms" }}
              />
            </div>
          )}
        </span>
      </div>

      {/* Status Icons */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        {!micOn && (
          <div className="rounded-full bg-cath-red-50 p-1.5 border border-cath-red-100 shadow-sm">
            <FiMicOff className="h-4 w-4 text-cath-red-500" />
          </div>
        )}
        {!videoOn && (
          <div className="rounded-full bg-cath-red-50 p-1.5 border border-cath-red-100 shadow-sm">
            <FiVideoOff className="h-4 w-4 text-cath-red-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoTile
