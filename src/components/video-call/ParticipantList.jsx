import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi"
import useAudioLevel from "@/hooks/useAudioLevel"

const ParticipantItem = ({ participant, isMe, isConnected, stream }) => {
  const audioLevel = useAudioLevel(stream)
  const isMicOn = participant.isMicOn !== false // Default true if undefined

  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#303134]">
      <div className="relative">
        <img
          src={participant.avatarImageUrl || "https://via.placeholder.com/40"}
          alt={participant.username}
          className="h-10 w-10 rounded-full object-cover"
        />

        {/* Audio Indicator Ring */}
        {isMicOn && audioLevel > 5 && (
          <div
            className="absolute inset-0 rounded-full border-2 border-green-500 opacity-80 transition-all duration-100 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
            style={{
              transform: `scale(${1 + Math.min(audioLevel / 50, 0.3)})`,
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="truncate text-sm font-medium">
          {participant.username} {isMe && "(You)"}
        </div>
      </div>

      <div className="flex gap-2">
        {!isMicOn ? (
          <FiMicOff className="h-4 w-4 text-red-400" />
        ) : (
          <FiMic
            className={`h-4 w-4 ${
              audioLevel > 5 ? "text-green-400" : "text-gray-400"
            }`}
          />
        )}
      </div>
    </div>
  )
}

const ParticipantList = ({ participants, peers, currentUserId }) => {
  return (
    <div className="h-full w-full flex-col bg-[#202124] text-gray-100 border-l border-[#303134]">
      <div className="border-b border-[#303134] px-4 py-3">
        <h3 className="text-sm font-semibold">
          Participants ({participants.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((p) => {
          const isMe = String(p.accountId) === String(currentUserId)
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
