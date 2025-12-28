
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi'

const ParticipantList = ({ participants, peers, currentUserId }) => {
  return (
    <div className="h-full w-full flex-col bg-[#202124] text-gray-100 border-l border-[#303134]">
        <div className="border-b border-[#303134] px-4 py-3">
            <h3 className="text-sm font-semibold">Participants ({participants.length})</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
            {participants.map((p) => {
                const isMe = p.accountId === parseInt(currentUserId)
                const isConnected = isMe || !!peers[p.accountId]
                
                return (
                    <div key={p.accountId} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#303134]">
                        <div className="relative">
                            <img 
                                src={p.avatarImageUrl || 'https://via.placeholder.com/40'} 
                                alt={p.username}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#202124] ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <div className="truncate text-sm font-medium">
                                {p.username} {isMe && '(You)'}
                            </div>
                            <div className="text-xs text-gray-400">
                                {isConnected ? 'Online' : 'Offline'}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* Status icons - Placeholder for now as we don't have individual mic state for remote yet */}
                             <FiMic className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}



export default ParticipantList
