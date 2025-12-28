
import VideoTile from './VideoTile'

const VideoGrid = ({ localStream, peers, participants, currentUserId }) => {
  // Merge participants with peers to get streams
  // We want to show:
  // 1. Local User
  // 2. Remote Participants (matched with peers streams)
  
  // Create a map for easy lookup of peer data
  const getPeerStream = (accountId) => peers[accountId]?.stream
  
  // Calculate grid columns based on count
  const count = participants.length + 1 // +1 for local user (if not in participants list yet, but typically we treat separately)
  
  const gridClassName = 
    count === 1 ? 'grid-cols-1' :
    count === 2 ? 'grid-cols-2' :
    count <= 4 ? 'grid-cols-2 grid-rows-2' :
    'grid-cols-3'

  return (
    <div className={`grid h-full w-full gap-4 ${gridClassName} p-4`}>
        {/* Local User */}
        {/* We can find current user in participants to get Avatar/Name if needed, or pass user object */}
        {/* For now assuming passed props or separate handling */}
      <div className="relative">
          <VideoTile
            stream={localStream}
            name="You"
            avatar={null} // TODO: Pass user avatar
            isLocal={true}
            micOn={true} // TODO: sync local mic state
          />
      </div>

      {/* Remote Participants */}
      {participants.filter(p => p.accountId !== parseInt(currentUserId)).map((participant) => (
        <div key={participant.participantId || participant.accountId} className="relative">
          <VideoTile
            stream={getPeerStream(participant.accountId)}
            name={participant.username}
            avatar={participant.avatarImageUrl}
            isLocal={false}
            micOn={true} // TODO: sync remote mic state from SignalR
          />
        </div>
      ))}
    </div>
  )
}

export default VideoGrid
