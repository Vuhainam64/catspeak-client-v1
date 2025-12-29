import VideoTile from "./VideoTile"

const VideoGrid = ({ localStream, peers, participants, currentUserId }) => {
  // Merge participants with peers to get streams
  // We want to show:
  // 1. Local User
  // 2. Remote Participants (matched with peers streams)

  // Create a map for easy lookup of peer data
  const getPeerStream = (accountId) => peers[accountId]?.stream

  // Calculate grid columns based on count
  const count = participants.length

  const gridClassName =
    count === 1
      ? "grid-cols-1"
      : count === 2
      ? "grid-cols-2"
      : count <= 4
      ? "grid-cols-2 grid-rows-2"
      : "grid-cols-3"

  return (
    <div className={`grid h-full w-full gap-4 ${gridClassName} p-4`}>
      {participants.map((participant) => {
        const isLocal = String(participant.accountId) === String(currentUserId)
        // If local, use localStream. If remote, look up in peers.
        const stream = isLocal
          ? localStream
          : getPeerStream(participant.accountId)

        return (
          <div
            key={participant.participantId || participant.accountId}
            className="relative"
          >
            <VideoTile
              stream={stream}
              name={participant.username}
              avatar={participant.avatarImageUrl}
              isLocal={isLocal}
              micOn={participant.isMicOn !== false} // Default to true if undefined
            />
          </div>
        )
      })}
    </div>
  )
}

export default VideoGrid
