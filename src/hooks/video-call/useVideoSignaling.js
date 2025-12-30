import { useState, useRef, useEffect } from "react"
import * as signalR from "@microsoft/signalr"

export const useVideoSignaling = (sessionId, shouldJoin, handlers = {}) => {
  const [isConnected, setIsConnected] = useState(false)
  const connectionRef = useRef(null)

  // We use a ref for handlers ensuring we always call the latest ones
  // without re-running the effect when handlers change (if they are recreated)
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!sessionId || !token || !shouldJoin) return

    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const hubBaseUrl = apiUrl.replace(/\/api\/?$/, "")

    // Build Connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubBaseUrl}/hubs/videoChat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Error)
      .build()

    connectionRef.current = newConnection

    // Wrapper to call the current handler safely
    const safeHandler =
      (name) =>
      (...args) => {
        console.log(`[SignalR] Event Received: ${name}`, args)
        const handler = handlersRef.current[name]
        if (handler) {
          handler(...args)
        } else {
          console.warn(
            `[SignalR] No handler found for: ${name}`,
            Object.keys(handlersRef.current)
          )
        }
      }

    // Map of internal event names to handler keys
    // You can extend this mapping as needed
    const eventMapping = {
      ReceiveOffer: "ReceiveOffer",
      ReceiveAnswer: "ReceiveAnswer",
      ReceiveIceCandidate: "ReceiveIceCandidate",
      ReceiveMessage: "ReceiveMessage",
      receiveMessage: "ReceiveMessage", // Alias
      ParticipantJoined: "ParticipantJoined",
      participantJoined: "ParticipantJoined", // Alias
      UserJoined: "ParticipantJoined", // Alias
      ParticipantLeft: "ParticipantLeft",
      ParticipantAudioChanged: "ParticipantAudioChanged",
      ParticipantVideoChanged: "ParticipantVideoChanged",
      SessionEnded: "SessionEnded",
    }

    // Bind all unique events
    const uniqueEvents = [...new Set(Object.keys(eventMapping))]
    uniqueEvents.forEach((evtName) => {
      newConnection.on(evtName, safeHandler(eventMapping[evtName]))
    })

    // Monitor Connection State
    newConnection.onclose(() => setIsConnected(false))
    newConnection.onreconnecting(() => setIsConnected(false))
    newConnection.onreconnected(() => setIsConnected(true))

    // Start
    const start = async () => {
      try {
        await newConnection.start()
        console.log("SignalR Connected")
        setIsConnected(true)
        await newConnection.invoke("JoinSession", parseInt(sessionId))

        // Notify ready (optional, if we wanted to expose a generic onConnected)
        if (handlersRef.current.OnConnected) {
          handlersRef.current.OnConnected(newConnection)
        }
      } catch (err) {
        console.error("SignalR Init Error:", err)
        setIsConnected(false)
      }
    }

    start()

    return () => {
      // Unbind and stop
      uniqueEvents.forEach((evtName) => {
        newConnection.off(evtName)
      })
      newConnection.stop()
      connectionRef.current = null
    }
  }, [sessionId, shouldJoin])

  const invoke = (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return connectionRef.current.invoke(methodName, ...args)
    }
    return Promise.reject("Not Connected")
  }

  return {
    connection: connectionRef.current,
    isConnected,
    invoke,
  }
}
