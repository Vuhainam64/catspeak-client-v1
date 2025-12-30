import React from "react"
import { useNavigate } from "react-router-dom"
import {
  FiUserCheck,
  FiLink,
  FiUsers,
  FiCalendar,
  FiClock,
} from "react-icons/fi"

const RoomCard = ({ room }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/room/${room.roomId}`)
  }

  // Safe defaults or mappings
  const createDate = new Date(room.createDate)
  const dateStr = createDate.toLocaleDateString("vi-VN")
  const timeStr = createDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })
  const statusLabel = room.status === 1 ? "Đang diễn ra" : "Đã kết thúc"

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
    >
      {/* Header / Banner Area with Pattern */}
      <div className="relative flex h-32 w-full items-start justify-between bg-slate-50 p-4">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Status Badge */}
        <div
          className={`relative z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            room.status === 1
              ? "bg-[#990011] text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {statusLabel}
        </div>

        {/* Decorative Corner Icon using Room ID */}
        <div className="absolute -bottom-6 -right-6 z-0 rounded-full bg-slate-100 p-8 opacity-50">
          <span className="text-8xl font-black text-slate-200 select-none">
            {room.roomId % 10}
          </span>
        </div>
      </div>

      <div className="relative px-5 pb-5 pt-8">
        {/* Floating Room ID Badge */}
        <div className="absolute -top-6 left-5 flex h-12 min-w-[3rem] items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
          <span className="text-xl font-bold text-gray-700">
            #{room.roomId}
          </span>
        </div>

        <h3 className="mb-1 text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem] pt-2 group-hover:text-[#990011] transition-colors duration-200">
          {room.name}
        </h3>

        <div className="my-3 h-px w-full bg-gray-100" />

        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          {/* 
          <div className="flex items-center gap-1.5" title="Capacity">
            <FiUsers className="h-4 w-4 text-gray-400" />
            <span>2/5</span>
          </div>
          */}

          <div className="flex items-center gap-1.5">
            <FiCalendar className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span>{dateStr}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <FiClock className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RoomCard
