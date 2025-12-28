import React, { useState } from "react";
import {
  FiMessageCircle,
  FiSend,
  FiSearch,
  FiMoreVertical,
  FiPlus,
  FiPaperclip,
  FiImage,
} from "react-icons/fi";

const demoConversations = [
  { id: 1, name: "CATH", last: "Xin chào, bạn cần hỗ trợ gì?", unread: 2, color: "#c21010" },
  { id: 2, name: "Nguyễn A", last: "Tối nay học không?", unread: 0, color: "#2563eb" },
  { id: 3, name: "Lý C", last: "Nhớ gửi tài liệu nhé", unread: 1, color: "#f59e0b" },
  { id: 4, name: "Trần B", last: "Hello!", unread: 0, color: "#0ea5e9" },
];

const MessageWidget = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(demoConversations[0]);
  const [input, setInput] = useState("");

  return (
    <div className="fixed bottom-4 right-4 z-[1200] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] max-w-[90vw] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex h-9 flex-1 items-center rounded-full border border-gray-200 px-3 text-sm text-gray-600">
              <FiSearch className="mr-2 h-4 w-4 text-gray-400" />
              <input
                className="w-full bg-transparent outline-none placeholder:text-gray-400"
                placeholder="Tìm kiếm"
              />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow hover:scale-105"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col px-4 pt-3">
            <div className="text-xs font-semibold text-gray-900">TIN NHẮN</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex-1 space-y-2">
                {demoConversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={[
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 transition",
                      selected?.id === c.id ? "bg-gray-100" : "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                        style={{ background: c.color }}
                      >
                        {c.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.last}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.unread > 0 && (
                        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#990011] px-1 text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                      <FiMoreVertical className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Slim divider */}
              <div className="w-1 rounded-full bg-[#990011] opacity-80" style={{ height: "220px" }} />
            </div>
          </div>

          {/* Chat area (static demo) */}
          <div className="mt-3 space-y-2 px-4 pb-2">
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800 shadow-inner">
              Chào bạn, bạn cần hỗ trợ gì?
            </div>
            <div className="flex justify-end">
              <div className="rounded-2xl bg-[#990011] px-4 py-3 text-sm text-white shadow">
                Mình cần tài liệu speaking!
              </div>
            </div>
            <div className="text-center text-[10px] italic text-gray-400">17:30 — 03/09/2025</div>
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800 shadow-inner">
              Đã gửi bạn rồi nhé!
            </div>
          </div>

          {/* Input area */}
          <div className="flex items-center gap-2 border-t px-4 py-3">
            <button className="text-[#990011] hover:opacity-80" aria-label="Thêm">
              <FiPlus className="h-5 w-5" />
            </button>
            <button className="text-[#990011] hover:opacity-80" aria-label="Đính kèm">
              <FiPaperclip className="h-5 w-5" />
            </button>
            <button className="text-[#990011] hover:opacity-80" aria-label="Ảnh">
              <FiImage className="h-5 w-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Aa"
              className="h-9 flex-1 rounded-full border border-gray-200 px-3 text-sm outline-none focus:border-[#990011]"
            />
            <button
              onClick={() => setInput("")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow hover:scale-105"
              aria-label="Gửi"
            >
              <FiSend className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#990011] text-white shadow-lg transition hover:scale-105"
        aria-label="Mở tin nhắn"
      >
        <FiMessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MessageWidget;

