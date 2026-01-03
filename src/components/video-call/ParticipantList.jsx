import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi"
import useAudioLevel from "@/hooks/useAudioLevel"

const ParticipantItem = ({ participant, isMe, isConnected, stream }) => {
  const audioLevel = useAudioLevel(stream)

  // We rely on the participant.isMicOn / isCameraOn properties (which align with SDK state)
  // rather than checking tracks, to ensures the UI icons match the Control Bar immediately.
  const isMicOn = participant.isMicOn !== false
  const isCameraOn = participant.isCameraOn !== false

  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-colors">
      <div className="relative">
        {participant.avatarImageUrl ? (
          <img
            src={participant.avatarImageUrl}
            alt={participant.username}
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              e.target.style.display = "none"
              // The next sibling (placeholder) could be shown via CSS or state,
              // but simplest is to handle it in state or just let the fallback exist.
              // For valid URLs that fail loading, simpler to use a state, but
              // for now let's focus on the prop check as requested.
            }}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm border border-indigo-200">
            {(participant.username || "?").charAt(0).toUpperCase()}
          </div>
        )}

        {/* Audio Indicator Ring */}
        {isMicOn && audioLevel > 5 && (
          <div
            className="absolute inset-0 rounded-full border-2 border-emerald-500 opacity-80 transition-all duration-100 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
            style={{
              transform: `scale(${1 + Math.min(audioLevel / 50, 0.3)})`,
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="truncate text-sm font-medium text-headingColor">
          {participant.username} {isMe && "(You)"}
        </div>
      </div>

      <div className="flex gap-2">
        {/* Camera Indicator */}
        {!isCameraOn ? (
          <FiVideoOff className="h-4 w-4 text-cath-red-400" />
        ) : (
          <FiVideo className="h-4 w-4 text-gray-400" />
        )}

        {/* Mic Indicator */}
        {!isMicOn ? (
          <FiMicOff className="h-4 w-4 text-cath-red-400" />
        ) : (
          <FiMic className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  )
}

const ParticipantList = ({ participants, peers, currentUserId }) => {
  return (
    <div className="h-full w-full flex-col bg-white text-textColor border-l border-gray-200">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold">
          Participants ({participants.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {participants.map((p) => {
          const isMe =
            String(p.accountId) === String(currentUserId) ||
            String(p.userId) === String(currentUserId) ||
            String(p.id) === String(currentUserId)
          const isConnected =
            isMe || !!peers[String(p.accountId)] || !!peers[p.accountId]
          // For local user, we might not have 'stream' in 'participants' array if not merged properly,
          // but usually the hook merges it. If not, it falls back gracefully.
          // For remote peers, p.stream should be set if available.

          return (
            <ParticipantItem
              key={p.accountId}
              participant={p}
              isMe={isMe}
              isConnected={isConnected}
              stream={p.stream}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ParticipantList
