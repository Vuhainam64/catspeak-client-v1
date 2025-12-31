import React, { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { useQueueSignaling } from "@/hooks/useQueueSignaling"
const QueuePage = () => {
  const navigate = useNavigate()

  // Local state
  const [statusText, setStatusText] = useState("Đang kết nối vào hàng chờ...")
  const [position, setPosition] = useState(0)
  const [hasJoinedSignalR, setHasJoinedSignalR] = useState(false)

  // SignalR Handlers
  const handlers = useMemo(
    () => ({
      MatchFound: (data) => {
        console.log("MATCH FOUND EVENT:", data)
        setStatusText(data.message || "Đã tìm thấy match!")
        if (data.sessionId) {
          // Play notification sound?
          setTimeout(() => {
            navigate(`/meet/${data.sessionId}`)
          }, 1000)
        }
      },
      QueueJoined: (data) => {
        console.log("QueueJoined event received!", data)
        setStatusText("Đang chờ ghép đôi...")
        if (data && data.position) setPosition(data.position)
        setHasJoinedSignalR(true)
      },
      QueueStatus: (data) => {
        // Handle periodic updates if manually invoked or pushed
        // console.log("queue status update:", data)
        if (data) {
          if (data.position) setPosition(data.position)
        }
      },
      QueueError: (msg) => {
        console.error("Queue Error:", msg)
        setStatusText(`Lỗi: ${msg}`)
      },
      OnReconnected: () => {
        console.log("Reconnected to SignalR. Re-joining queue...")
        // Explicitly re-join because server removes user on disconnect
        // We can't call joinQueue() directly here because it's not in scope of useMemo
        // But we can trigger a state change or dependency.
        setHasJoinedSignalR(false)
      },
    }),
    [navigate]
  )

  const { isConnected, joinQueue, leaveQueue } = useQueueSignaling(handlers)

  // Reset join attempt ref if disconnected
  useEffect(() => {
    if (!isConnected) {
      joinAttemptedRef.current = false
      setHasJoinedSignalR(false)
    }
  }, [isConnected])

  // Flow:
  // 1. User enters page -> Call REST API Join (User request: "user join queue (api join queue)")
  // 2. Front end calls "JoinQueue" (SignalR)

  // Guard to prevent double execution
  const joinAttemptedRef = React.useRef(false)

  useEffect(() => {
    // Connect first (handled by hook mount)
    if (isConnected && !hasJoinedSignalR && !joinAttemptedRef.current) {
      joinAttemptedRef.current = true // Mark as attempted immediately

      const initQueue = async () => {
        try {
          console.log("Invoking SignalR JoinQueue...")
          await joinQueue()
          // Success handled in 'QueueJoined' event
        } catch (err) {
          console.error("Failed to join queue:", err)
          joinAttemptedRef.current = false
        }
      }
      initQueue()
    }
  }, [isConnected, hasJoinedSignalR, joinQueue])

  const handleCancel = async () => {
    try {
      console.log("Leaving queue...")
      await leaveQueue() // SignalR leave
      navigate(-1)
    } catch (err) {
      console.error("Failed to leave queue", err)
      navigate(-1)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary2 text-textColor font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border-t-4 border-cath-orange-500"
      >
        {/* Decorative background blob */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-cath-orange-50/50 to-transparent rounded-t-3xl -z-10" />

        <div className="mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-orange-100 relative overflow-hidden ring-4 ring-white shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-cath-orange-200 to-orange-100 opacity-50" />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-28 w-28 rounded-full bg-gradient-to-br from-cath-orange-500 to-red-500 shadow-xl shadow-orange-500/20"
          />
          <div className="absolute text-5xl drop-shadow-sm">😺</div>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-headingColor text-center drop-shadow-sm">
          {statusText}
        </h2>

        <div className="h-4"></div>

        {isConnected ? (
          <span className="mb-6 inline-flex items-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 shadow-sm border border-green-200">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-600 shadow-sm"></span>
            Socket Connected
          </span>
        ) : (
          <span className="mb-6 inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 shadow-sm border border-amber-200">
            <span className="mr-2 h-2 w-2 rounded-full bg-amber-500 animate-bounce"></span>
            Connecting...
          </span>
        )}

        <p className="mb-8 text-center text-gray-500 text-sm leading-relaxed max-w-[90%]">
          Chúng mình đang tìm người phù hợp nhất với trình độ của bạn.
        </p>

        {position > 0 && (
          <div className="mb-8 flex items-center gap-2 rounded-xl bg-gray-50 px-5 py-3 text-sm font-medium text-headingColor border border-gray-100">
            <span>Vị trí của bạn:</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm border border-gray-100 text-cath-orange-600 font-bold">
              {position}
            </span>
          </div>
        )}

        <button
          onClick={handleCancel}
          className="bg-[#990011] text-white mt-4 rounded-full px-8 py-3 text-sm font-bold text-gray-500 ring-1 ring-gray-200 transition hover:bg-red-50 hover:text-red-500 hover:ring-red-200 active:scale-95"
        >
          Hủy tìm kiếm
        </button>
      </motion.div>
    </div>
  )
}

export default QueuePage
