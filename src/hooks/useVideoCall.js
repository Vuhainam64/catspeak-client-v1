import { useEffect, useRef, useState, useMemo } from "react"
import { useDispatch } from "react-redux"
import * as signalR from "@microsoft/signalr"
import { videoSessionsApi } from "@/store/api/videoSessionsApi"

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
}

/**
 * Helper to acquire media stream with fallback strategy
 * Video+Audio -> Audio Only -> Video Only -> Null
 */
const acquireMediaStream = async () => {
  // Guard against missing mediaDevices (e.g. insecure context)
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn(
      "navigator.mediaDevices.getUserMedia is not available. Joining as listener."
    )
    return null
  }

  const getMedia = async (constraints) => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      return null
    }
  }

  // 1. Try Video + Audio
  let stream = await getMedia({ video: true, audio: true })

  // 2. If failed, try Audio only (common fallback)
  if (!stream) {
    stream = await getMedia({ video: false, audio: true })
  }

  // 3. If failed, try Video only (rare, but possible)
  if (!stream) {
    stream = await getMedia({ video: true, audio: false })
  }

  if (stream) {
    // Stream acquired
  } else {
    console.warn(
      "No media devices could be acquired. Joining as listener (Receive Only)."
    )
  }

  return stream
}

export const useVideoCall = (sessionId, user, token, initialParticipants) => {
  const dispatch = useDispatch()

  // -- State --
  const [connection, setConnection] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [peers, setPeers] = useState({}) // { [id]: { stream, pc, ... } }

  // -- Refs (for access in callbacks/effects without triggering re-runs) --
  const peersRef = useRef({})
  const localStreamRef = useRef(null)
  const connectionRef = useRef(null)

  // -- 1. Sync Initial Data --
  useEffect(() => {
    if (initialParticipants) {
      setParticipants((prev) => {
        // Merge API data with existing state to preserve flags if any
        return initialParticipants.map((apiP) => {
          const existing = prev.find((p) => p.accountId === apiP.accountId)
          return existing
            ? {
                ...apiP,
                isMicOn: existing.isMicOn,
                isCameraOn: existing.isCameraOn,
              }
            : apiP
        })
      })
    }
  }, [initialParticipants])

  // -- 2. Media Initialization --
  useEffect(() => {
    let mounted = true

    acquireMediaStream().then((stream) => {
      if (mounted && stream) {
        setLocalStream(stream)
        localStreamRef.current = stream
      }
    })

    return () => {
      mounted = false
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // -- 2b. Late Stream Attachment (if stream arrives after connection) --
  useEffect(() => {
    if (!localStream) return

    Object.keys(peersRef.current).forEach((userId) => {
      const peer = peersRef.current[userId]
      if (peer && peer.peerConnection) {
        const pc = peer.peerConnection
        const senders = pc.getSenders()

        localStream.getTracks().forEach((track) => {
          if (!senders.find((s) => s.track?.kind === track.kind)) {
            pc.addTrack(track, localStream)
          }
        })
      }
    })
  }, [localStream])

  // -- 3. SignalR & WebRTC Logic --
  useEffect(() => {
    if (!sessionId || !token) return

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

    setConnection(newConnection)
    connectionRef.current = newConnection

    // --- WebRTC Helpers (Closure maintains access to 'newConnection') ---

    const createPeerConnection = async (targetId, remoteOffer = null) => {
      if (peersRef.current[targetId]) return null // Already exists

      const pc = new RTCPeerConnection(ICE_SERVERS)

      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStreamRef.current))
      }

      // Handle ICE
      pc.onicecandidate = (event) => {
        if (
          event.candidate &&
          newConnection.state === signalR.HubConnectionState.Connected
        ) {
          newConnection
            .invoke(
              "SendIceCandidate",
              parseInt(sessionId),
              parseInt(targetId),
              JSON.stringify(event.candidate)
            )
            .catch((err) => console.error("SendIceCandidate Error:", err))
        }
      }

      // Handle Stream
      pc.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [targetId]: { ...prev[targetId], stream: event.streams[0] },
        }))
      }

      // Store PC
      peersRef.current[targetId] = { peerConnection: pc }
      setPeers((prev) => ({
        ...prev,
        [targetId]: { ...prev[targetId], peerConnection: pc },
      }))

      // Handle Offer if provided (Answer)
      if (remoteOffer) {
        await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        if (newConnection.state === signalR.HubConnectionState.Connected) {
          await newConnection.invoke(
            "SendAnswer",
            parseInt(sessionId),
            parseInt(targetId),
            JSON.stringify(answer)
          )
        }
      }

      return pc
    }

    const initiateConnection = async (targetId) => {
      const pc = await createPeerConnection(targetId)
      if (!pc) return

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      if (newConnection.state === signalR.HubConnectionState.Connected) {
        await newConnection.invoke(
          "SendOffer",
          parseInt(sessionId),
          parseInt(targetId),
          JSON.stringify(offer)
        )
      }
    }

    // --- Event Handlers ---

    // Safe Argument Extractor (handles variable SignalR args)
    const getArg = (args, fallbackIndex = 0) =>
      args.length === 2 ? args[1] : args[fallbackIndex]

    const handlers = {
      ReceiveOffer: async (sessId, senderId, offerJson) => {
        await createPeerConnection(senderId, JSON.parse(offerJson))
      },
      ReceiveAnswer: async (sessId, senderId, answerJson) => {
        const peer = peersRef.current[senderId]
        if (peer)
          await peer.peerConnection.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(answerJson))
          )
      },
      ReceiveIceCandidate: async (sessId, senderId, candidatesJson) => {
        const peer = peersRef.current[senderId]
        if (peer)
          await peer.peerConnection.addIceCandidate(
            new RTCIceCandidate(JSON.parse(candidatesJson))
          )
      },
      ReceiveMessage: (sessId, senderId, content, timestamp) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            senderId,
            content,
            timestamp: timestamp || new Date().toISOString(),
          },
        ])
      },
      ParticipantJoined: (...args) => {
        const participant = getArg(args)
        if (!participant) return

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: "system",
            content: `${participant.username} joined the chat`,
          },
        ])

        setParticipants((prev) => {
          if (prev.find((p) => p.accountId === participant.accountId))
            return prev
          return [...prev, participant]
        })
        initiateConnection(participant.accountId)
        dispatch(
          videoSessionsApi.util.invalidateTags([
            { type: "VideoSessions", id: String(sessionId) },
          ])
        )
      },
      ParticipantLeft: (...args) => {
        const accountId = getArg(args)
        if (!accountId) return

        if (peersRef.current[accountId]) {
          peersRef.current[accountId].peerConnection.close()
          delete peersRef.current[accountId]
        }

        setParticipants((prev) => {
          const user = prev.find((p) => p.accountId === accountId)
          if (user) {
            setMessages((msgs) => [
              ...msgs,
              {
                id: Date.now(),
                type: "system",
                content: `${user.username} left the chat`,
              },
            ])
          }
          return prev.filter((p) => p.accountId !== accountId)
        })

        setPeers((prev) => {
          const next = { ...prev }
          delete next[accountId]
          return next
        })
        dispatch(
          videoSessionsApi.util.invalidateTags([
            { type: "VideoSessions", id: String(sessionId) },
          ])
        )
      },
      ParticipantAudioChanged: (sessId, userId, isEnabled) => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.accountId === userId ? { ...p, isMicOn: isEnabled } : p
          )
        )
      },
      ParticipantVideoChanged: (sessId, userId, isEnabled) => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.accountId === userId ? { ...p, isCameraOn: isEnabled } : p
          )
        )
      },
      SessionEnded: () => {
        dispatch(
          videoSessionsApi.util.invalidateTags([
            { type: "VideoSessions", id: String(sessionId) },
          ])
        )
      },
    }

    // Bind Events
    Object.keys(handlers).forEach((event) => {
      newConnection.on(event, handlers[event])
    })
    // Aliases
    newConnection.on("receiveMessage", handlers.ReceiveMessage)
    newConnection.on("participantJoined", handlers.ParticipantJoined)
    newConnection.on("UserJoined", handlers.ParticipantJoined)

    // Start
    const start = async () => {
      try {
        await newConnection.start()
        console.log("SignalR Connected")
        await newConnection.invoke("JoinSession", parseInt(sessionId))

        // Manual sync to be safe
        const res = await dispatch(
          videoSessionsApi.endpoints.getVideoSessionById.initiate(sessionId)
        ).unwrap()
        if (res?.participants) setParticipants(res.participants)
      } catch (err) {
        console.error("SignalR Init Error:", err)
      }
    }

    // Always start regardless of local stream
    start()

    return () => {
      newConnection.stop()
      Object.keys(peersRef.current).forEach((uid) =>
        peersRef.current[uid].peerConnection.close()
      )
    }
  }, [sessionId, token]) // Depends on Session/Token only

  // -- 4. Public Actions --

  const toggleMedia = (kind, enabled) => {
    if (!localStreamRef.current) return
    const tracks =
      kind === "audio"
        ? localStreamRef.current.getAudioTracks()
        : localStreamRef.current.getVideoTracks()
    tracks.forEach((t) => (t.enabled = enabled))

    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      const method = kind === "audio" ? "ToggleAudio" : "ToggleVideo"
      connectionRef.current
        .invoke(method, parseInt(sessionId), enabled)
        .catch(console.error)
    }
  }

  const toggleAudio = (en) => toggleMedia("audio", en)
  const toggleVideo = (en) => toggleMedia("video", en)

  const sendMessage = (text) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return connectionRef.current.invoke(
        "SendMessage",
        parseInt(sessionId),
        text
      )
    }
    return Promise.reject("Not Connected")
  }

  // Derived state for UI
  const mergedParticipants = useMemo(() => {
    return participants.map((p) => {
      const peer = peers[p.accountId]
      return {
        ...p,
        stream: peer?.stream || null,
        isActive: !!peer,
        isMicOn: p.isMicOn ?? true,
        isCameraOn: p.isCameraOn ?? true,
      }
    })
  }, [participants, peers])

  const isConnected = connection?.state === signalR.HubConnectionState.Connected

  return {
    connection,
    isConnected,
    localStream,
    peers,
    participants: mergedParticipants,
    messages,
    toggleAudio,
    toggleVideo,
    sendMessage,
  }
}
