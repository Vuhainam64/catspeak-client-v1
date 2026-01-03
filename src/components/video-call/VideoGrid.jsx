import VideoTile from "./VideoTile"

const VideoGrid = ({ localStream, peers, participants, currentUserId }) => {
  // Merge participants with peers to get streams
  // We want to show:
  // 1. Local User
  // 2. Remote Participants (matched with peers streams)

  // Calculate grid columns based on count
  const count = participants.length

  /*
    Grid Layout Logic:
    - 1 participant: Full screen (center)
    - 2 participants: Side by side (1 row, 2 cols) -> h-full
    - 3-4 participants: 2x2 grid (2 rows, 2 cols) -> h-full
    - 5-6 participants: 2x3 grid (2 rows, 3 cols) -> h-full
    - 7+ participants: 3 cols, auto rows
  */
  let gridClassName = ""

  if (count === 1) {
    gridClassName = "grid-cols-1 grid-rows-1"
  } else if (count === 2) {
    gridClassName = "grid-cols-2 grid-rows-1"
  } else if (count <= 4) {
    gridClassName = "grid-cols-2 grid-rows-2"
  } else if (count <= 6) {
    gridClassName = "grid-cols-3 grid-rows-2"
  } else {
    // Fallback for larger meetings if needed
    gridClassName = "grid-cols-3 auto-rows-fr"
  }

  return (
    <div className={`grid h-screen w-full gap-4 ${gridClassName} p-4`}>
      {participants.map((participant) => {
        // Note: isLocal calculation is still useful for UI,
        // but stream access is now normalized in `participant.stream`
        const isLocal = participant.isLocal

        // Use the stream directly attached to the participant object by useVideoCall
        const stream = participant.stream

        return (
          <div
            key={participant.id || participant.accountId}
            className="relative h-full w-full"
          >
            <VideoTile
              stream={stream}
              name={participant.username}
              avatar={participant.avatarImageUrl} // Note: VideoSDK might not pass this in metaData, check implementation
              isLocal={isLocal}
              micOn={participant.isMicOn !== false} // Default to true if undefined
              videoOn={participant.isCameraOn !== false} // Default to true if undefined
            />
          </div>
        )
      })}
    </div>
  )
}

export default VideoGrid
