import React, { useState, useRef, useEffect } from "react"
import * as signalR from "@microsoft/signalr"

import useAuth from "@/hooks/useAuth"

export const useQueueSignaling = (handlers = {}) => {
  const { token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionId, setConnectionId] = useState(null)
  const connectionRef = useRef(null)

  // Use ref for handlers to avoid effect dependency issues
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    if (!token) {
      console.warn("[QueueSignalR] No token found, cannot connect.")
      return
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const baseUrl = apiUrl.replace(/\/api\/?$/, "")
    const hubUrl = `${baseUrl}/hubs/queue`

    console.log("[QueueSignalR] Connecting to:", hubUrl)

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = newConnection

    const safeHandler =
      (name) =>
      (...args) => {
        // console.log(`[QueueSignalR] Event Received: ${name}`, args)
        const handler = handlersRef.current[name]
        if (handler) {
          handler(...args)
        }
      }

    // Bind Hub Events
    const events = [
      "QueueJoined",
      "QueueLeft",
      "QueueStatus",
      "MatchFound",
      "QueueError",
    ]
    events.forEach((evt) => {
      newConnection.on(evt, safeHandler(evt))
    })

    const start = async () => {
      try {
        await newConnection.start()
        console.log("[QueueSignalR] Connected, ID:", newConnection.connectionId)
        setIsConnected(true)
        setConnectionId(newConnection.connectionId)

        // Notify handler of connection if needed
        if (handlersRef.current.OnConnected) {
          handlersRef.current.OnConnected(newConnection)
        }
      } catch (err) {
        // Ignore AbortError in strict mode logs
        if (
          !err.toString().includes("AbortError") &&
          !err.toString().includes("negotiation")
        ) {
          console.error("[QueueSignalR] Connection Error:", err)
        }
        setIsConnected(false)
      }
    }

    start()

    newConnection.onreconnecting(() => {
      console.warn("[QueueSignalR] Reconnecting...")
    })

    newConnection.onreconnected((connectionId) => {
      console.log("[QueueSignalR] Reconnected. ID:", connectionId)
      setIsConnected(true)
      setConnectionId(connectionId)
      if (handlersRef.current.OnReconnected) {
        handlersRef.current.OnReconnected(connectionId)
      }
    })

    newConnection.onclose(() => {
      console.warn("[QueueSignalR] Disconnected")
      setIsConnected(false)
      setConnectionId(null)
    })

    return () => {
      // console.log("[QueueSignalR] Stopping connection...")
      newConnection.stop().catch(() => {})
      setIsConnected(false)
      setConnectionId(null)
      connectionRef.current = null
    }
  }, [token]) // run when token changes

  // Wrappers for specific hub methods - Stabilize with useCallback
  const invoke = React.useCallback(async (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return await connectionRef.current.invoke(methodName, ...args)
    }
    console.warn("[QueueSignalR] Cannot invoke, not connected.")
    return Promise.reject("Not Connected")
  }, [])

  const joinQueue = React.useCallback(() => invoke("JoinQueue"), [invoke])
  const leaveQueue = React.useCallback(() => invoke("LeaveQueue"), [invoke])
  const getQueueStatus = React.useCallback(
    () => invoke("GetQueueStatus"),
    [invoke]
  )

  return {
    isConnected,
    connectionId,
    invoke,
    joinQueue,
    leaveQueue,
    getQueueStatus,
  }
}
