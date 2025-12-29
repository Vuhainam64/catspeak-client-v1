import React, { useState, useRef, useEffect } from "react"
import { FiSend } from "react-icons/fi"

const ChatBox = ({
  messages,
  currentUser,
  allParticipants,
  onSendMessage,
  isConnected,
  className = "",
}) => {
  const [message, setMessage] = useState("")
  const scrollRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div
      className={`flex h-full flex-col border-l border-[#303134] bg-[#202124] ${className}`}
    >
      <div className="border-b border-[#303134] px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-100">Room Message</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet</div>
        ) : (
          messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div
                  key={msg.id}
                  className="text-xs text-center text-gray-500 italic my-2"
                >
                  {msg.content}
                </div>
              )
            }

            const isMe = String(msg.senderId) === String(currentUser?.id)
            const sender = allParticipants.find(
              (p) => p.accountId === msg.senderId
            )
            const senderName = isMe
              ? "You"
              : sender?.username || `User ${msg.senderId}`

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400">
                    {senderName}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[85%] break-words ${
                    isMe
                      ? "bg-[#8ab4f8] text-[#202124]"
                      : "bg-[#303134] text-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        {/* Auto-scroll anchor */}
        <div ref={scrollRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            disabled={!isConnected}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type Something..." : "Connecting..."}
            className="flex-1 rounded-lg border border-[#3c4043] bg-[#2a2a2b] px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-[#8ab4f8] focus:outline-none focus:ring-1 focus:ring-[#8ab4f8] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!isConnected || !message.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8ab4f8] text-[#202124] transition hover:bg-[#a6c8ff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
