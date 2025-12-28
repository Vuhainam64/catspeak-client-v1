import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUserCheck, FiLink, FiUsers, FiCalendar, FiClock } from "react-icons/fi";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${room.roomId}`);
  };

  // Safe defaults or mappings
  const createDate = new Date(room.createDate);
  const dateStr = createDate.toLocaleDateString('vi-VN');
  const timeStr = createDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const statusLabel = room.status === 1 ? "Đang diễn ra" : "Đã kết thúc";
  
  // Use placeholder image if none provided
  const image = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"; 

  return (
    <article
      onClick={handleClick}
      className="cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img src={image} alt={room.name} className="h-full w-full object-cover" />
        <div className={`absolute left-4 top-4 rounded-full px-4 py-1 text-xs font-semibold uppercase text-white shadow ${room.status === 1 ? 'bg-[#990011]' : 'bg-gray-500'}`}>
          {statusLabel}
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#990011] shadow"
          aria-label="Bookmark room"
        >
          <FiUserCheck className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-5 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{room.name}</h3>

        <div className="mt-3 flex items-center gap-2 text-[#f5c518]">
          <FiLink className="h-5 w-5" />
          <span className="text-sm font-semibold text-[#c38300]">#{room.roomId}</span>
        </div>

        <div className="my-4 h-px w-full bg-gray-200" />

        <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <FiUsers className="h-5 w-5 text-[#990011]" />
            <span>2/5</span> {/* Mock capacity as it's not in response */}
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="h-5 w-5 text-[#990011]" />
            <span className="whitespace-nowrap">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="h-5 w-5 text-[#990011]" />
            <span className="whitespace-nowrap">{timeStr}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;

