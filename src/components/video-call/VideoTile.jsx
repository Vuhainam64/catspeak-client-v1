import { FiMicOff } from "react-icons/fi"

const VideoTile = ({ stream, name, avatar, isLocal, micOn = true }) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-900 border border-gray-800">
      {stream ? (
        <video
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent feedback
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream
            }
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-800">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-24 w-24 rounded-full border-4 border-gray-700 object-cover"
              onError={(e) => {
                e.target.style.display = "none"
              }} // Hide if fails
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 border-4 border-gray-600 text-2xl font-bold text-gray-300">
              {(name || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1">
        <span className="text-sm font-medium text-white">
          {isLocal ? "You" : name}
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
