import React from "react"
import { FiMic, FiMicOff } from "react-icons/fi"
import useAudioLevel from "@/hooks/useAudioLevel"
const MicButton = ({ micOn, onToggle, stream, className = "" }) => {
  const audioLevel = useAudioLevel(stream)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Audio Ripple/Indicator */}
      {micOn && audioLevel > 5 && (
        <div
          className="absolute inset-0 rounded-full bg-cath-red-500 opacity-50 animate-ping"
          style={{ animationDuration: "1.5s" }}
        ></div>
      )}
      {micOn && audioLevel > 1 && (
        <div
          className="absolute inset-0 rounded-full border-2 border-emerald-500 opacity-80 transition-all duration-100"
          style={{
            transform: `scale(${1 + Math.min(audioLevel / 50, 0.4)})`,
          }}
        />
      )}

      <button
        onClick={onToggle}
        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition shadow-lg ${
          micOn
            ? "bg-cath-red-600 text-white hover:bg-cath-red-700"
            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
        }`}
      >
        {micOn ? (
          <FiMic className="h-5 w-5" />
        ) : (
          <FiMicOff className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}

export default MicButton
