import React from "react";
import { FiSend } from "react-icons/fi";

const defaultMessages = [
  "Có ai mới học tiếng anh khum?",
  "Lớp A2 – Gia đình mở chưa?",
  "Thầy ơi cho xin tài liệu!",
  "Team debate tối nay không?",
  "Link zoom đâu vậy mọi người?",
  "Có suất speaking 1:1 không?",
  "Đi du lịch cần luyện giao tiếp!",
  "Cho em hỏi lịch test đầu vào?",
  "Bạn ơi gửi lại slide giúp với!",
  "Tối có lớp AI không?",
];

const LiveMessages = ({
  messages = defaultMessages,
  onSend,
  inputValue = "",
  onChangeInput,
  userLetters = 2,
  totalLetters = 220,
}) => {
  const rows = [0, 1, 2];

  return (
    <div className="relative my-6 overflow-hidden rounded-3xl bg-white/60 px-2 py-3 ring-1 ring-gray-100">
      <div className="flex items-center justify-between px-2 pb-3">
        <div className="flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => onChangeInput?.(e.target.value)}
            maxLength={200}
            placeholder="Nhập tin nhắn..."
            className="h-9 w-72 rounded-full border border-[#c38300]/70 px-4 text-sm outline-none focus:border-[#990011]"
          />
          <button
            type="button"
            onClick={() => onSend?.(inputValue)}
            className="text-[#990011] transition hover:scale-105"
            aria-label="Gửi tin nhắn"
          >
            <FiSend className="h-5 w-5" />
          </button>
          <span className="text-xs text-gray-500">
            {inputValue.length} / 200
          </span>
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-semibold">{userLetters}</span> thư của bạn |{" "}
          <span className="font-semibold">{totalLetters}</span> lá thư
        </div>
      </div>
      <style>
        {`
        @keyframes live-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        `}
      </style>
      {rows.map((rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-3 py-1"
          style={{
            animation: "live-marquee 20s linear infinite",
            animationDelay: `${rowIdx * 2}s`,
            width: "200%",
          }}
        >
          {[...messages, ...messages].map((msg, idx) => (
            <span
              key={`${rowIdx}-${idx}`}
              className="inline-block rounded-full bg-[#990011] px-4 py-2 text-xs font-semibold text-white shadow"
            >
              {msg}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LiveMessages;

