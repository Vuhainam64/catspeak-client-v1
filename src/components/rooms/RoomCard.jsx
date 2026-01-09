import React from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "antd"
import { FiCalendar, FiClock } from "react-icons/fi"

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

  // Custom Cover Component
  const CardCover = () => (
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
        className={`relative z-10 w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
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
  )

  return (
    <Card
      hoverable
      onClick={handleClick}
      cover={<CardCover />}
      className="overflow-hidden rounded-3xl border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
      styles={{
        body: { padding: "1.25rem 1.25rem 1.25rem 1.25rem" },
      }}
    >
      <div className="relative pt-3">
        {/* Floating Room ID Badge */}
        <div className="absolute -top-[3.25rem] left-0 flex h-12 min-w-[3rem] items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
          <span className="text-xl font-bold text-gray-700">
            #{room.roomId}
          </span>
        </div>

        <h3 className="mb-1 text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem] pt-2 group-hover:text-[#990011] transition-colors duration-200">
          {room.name}
        </h3>

        <div className="my-3 h-px w-full bg-gray-100" />

        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="h-4 w-4 text-gray-400" />
            <span>{dateStr}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <FiClock className="h-4 w-4 text-gray-400" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default RoomCard
