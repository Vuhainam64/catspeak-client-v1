import { Outlet } from 'react-router-dom'

const VideoCallLayout = () => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <Outlet />
    </div>
  )
}

export default VideoCallLayout

