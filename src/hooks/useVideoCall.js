/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useMemo } from "react"
import { useDispatch } from "react-redux"
import { videoSessionsApi } from "@/store/api/videoSessionsApi"
import { useMediaStream } from "./video-call/useMediaStream"
import { useWebRTC } from "./video-call/useWebRTC"
import { useVideoSignaling } from "./video-call/useVideoSignaling"

export const useVideoCall = (
  sessionId,
  initialParticipants,
  currentUserId,
  shouldJoin = true
) => {
  const dispatch = useDispatch()
  const currentUserIdRef = useRef(currentUserId)

  // -- State (Session Data) --
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])

  // -- 1. Media Stream --
  const { localStream, toggleTrack, isMediaReady, startMedia, stopMedia } =
    useMediaStream()

  // -- 2. Signaling (Connection) --
  // We use a ref for handlers because useWebRTC methods depend on connection,
  // but connection depends on useVideoSignaling.
  // We'll update the handlers in the useEffect below.
  const handlersRef = useRef({})
  const { connection, isConnected, invoke } = useVideoSignaling(
    sessionId,
    shouldJoin,
    handlersRef.current
  )

  // -- 3. WebRTC --
  const {
    peers,
    peersRef,
    createPeerConnection,
    initiateConnection,
    closePeerConnection,
    addIceCandidate,
  } = useWebRTC(sessionId, localStream, connection)

  // -- Helpers --
  useEffect(() => {
    currentUserIdRef.current = currentUserId
  }, [currentUserId])

  const invalidateSession = () => {
    dispatch(
      videoSessionsApi.util.invalidateTags([
        { type: "VideoSessions", id: String(sessionId) },
      ])
    )
  }

  // Safe Argument Extractor
  const getArg = (args, fallbackIndex = 0) =>
    args.length === 2 ? args[1] : args[fallbackIndex]

  // -- 4. Event Handlers Logic --
  useEffect(() => {
    // We define the handlers here where we have access to `createPeerConnection`, etc.
    // We mutate handlersRef.current so useVideoSignaling picks up the new logic
    // when it executes its safeHandler lookups.

    const handlers = {
      ReceiveOffer: async (sessId, senderId, offerJson) => {
        await createPeerConnection(senderId, JSON.parse(offerJson))
      },
      ReceiveAnswer: async (sessId, senderId, answerJson) => {
        const peer = peersRef.current[senderId]
        if (peer?.peerConnection) {
          await peer.peerConnection.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(answerJson))
          )
        }
      },
      ReceiveIceCandidate: async (sessId, senderId, candidatesJson) => {
        try {
          const candidate = new RTCIceCandidate(JSON.parse(candidatesJson))
          await addIceCandidate(senderId, candidate)
        } catch (e) {
          console.error(
            `[useVideoCall] Error parsing/adding candidate for ${senderId}:`,
            e
          )
        }
      },
      ReceiveMessage: (sessId, senderId, content, timestamp) => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            senderId,
            content,
            timestamp: timestamp || new Date().toISOString(),
          },
        ])
      },
      ParticipantJoined: (...args) => {
        const participant = getArg(args)
        if (!participant) return

        if (participant.accountId === currentUserIdRef.current) {
          return
        }

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: "system",
            content: `${participant.username} joined the chat`,
          },
        ])

        setParticipants((prev) => {
          if (prev.find((p) => p.accountId === participant.accountId))
            return prev
          return [...prev, participant]
        })
        // Strategy Change: Do NOT initiate here. Wait for joiner to call us.
        // initiateConnection(participant.accountId)
        console.log(
          `[useVideoCall] Participant joined: ${participant.username}. Waiting for offer.`
        )
        invalidateSession()
      },
      ParticipantLeft: (...args) => {
        const accountId = getArg(args)
        if (!accountId) return

        closePeerConnection(accountId)

        setParticipants((prev) => {
          const user = prev.find((p) => p.accountId === accountId)
          if (user) {
            setMessages((msgs) => [
              ...msgs,
              {
                id: crypto.randomUUID(),
                type: "system",
                content: `${user.username} left the chat`,
              },
            ])
          }
          return prev.filter((p) => p.accountId !== accountId)
        })
        invalidateSession()
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
        invalidateSession()
      },
    }

    // Assign to Ref
    Object.assign(handlersRef.current, handlers)

    // Cleanup isn't strictly necessary for the ref itself, but good practice if we wanted to clear handlers
    return () => {
      // We could clear handlersRef.current but it might break if async events fire after unmount?
      // useVideoSignaling handles cleanup of connection/events, so it won't call handlers after unmount.
    }
  }, [
    createPeerConnection,
    initiateConnection,
    closePeerConnection,
    sessionId,
    dispatch,
  ])
  // Sync Initial Participants & Initiate Connections (Joiner Calls Everyone)
  const hasInitiatedRef = useRef(false)

  // Ensure we don't initiate until we have the local stream OR decided we won't have one (receive only)
  // AND SignalR is connected (otherwise offers are lost)
  useEffect(() => {
    if (initialParticipants && currentUserId && isMediaReady && isConnected) {
      setParticipants((prev) => {
        return initialParticipants.map((apiP) => {
          const existing = prev.find((p) => p.accountId === apiP.accountId)
          return existing
            ? {
                ...apiP,
                isMicOn: existing.isMicOn,
                isCameraOn: existing.isCameraOn,
                // Ensure we don't overwrite remote stream references if they exist in prev?
                // Actually prev is mainly for local toggles/peers.
              }
            : apiP
        })
      })

      // Strategy Change: Joiner calls everyone ONE TIME
      // Only proceed if we haven't initiated AND media is ready AND SignalR is connected
      if (!hasInitiatedRef.current && initialParticipants.length > 0) {
        hasInitiatedRef.current = true
        initialParticipants.forEach((p) => {
          if (String(p.accountId) !== String(currentUserId)) {
            console.log(
              `[useVideoCall] Initiating connection to existing peer (ONCE, MediaReady, Connected): ${p.username} (${p.accountId})`
            )
            initiateConnection(p.accountId)
          }
        })
      }
    }
  }, [initialParticipants, currentUserId, isMediaReady, isConnected])

  // -- Public Actions --

  const toggleAudio = (en) => {
    toggleTrack("audio", en)
    // Optimistic Update
    setParticipants((prev) =>
      prev.map((p) =>
        String(p.accountId) === String(currentUserId)
          ? { ...p, isMicOn: en }
          : p
      )
    )
    if (isConnected)
      invoke("ToggleAudio", parseInt(sessionId), en).catch(console.error)
  }

  const toggleVideo = (en) => {
    toggleTrack("video", en)
    // Optimistic Update
    setParticipants((prev) =>
      prev.map((p) =>
        String(p.accountId) === String(currentUserId)
          ? { ...p, isCameraOn: en }
          : p
      )
    )
    if (isConnected)
      invoke("ToggleVideo", parseInt(sessionId), en).catch(console.error)
  }

  const sendMessage = (text) => {
    if (isConnected) {
      return invoke("SendMessage", parseInt(sessionId), text)
    }
    return Promise.reject("Not Connected")
  }

  // Derived state for UI
  const mergedParticipants = useMemo(() => {
    return participants.map((p) => {
      // If this is the local user, use the local stream
      if (String(p.accountId) === String(currentUserIdRef.current)) {
        return {
          ...p,
          stream: localStream,
          isActive: true,
          isMicOn: p.isMicOn ?? true,
          isCameraOn: p.isCameraOn ?? true,
        }
      }

      const peer = peers[p.accountId]
      return {
        ...p,
        stream: peer?.stream || null,
        isActive: !!peer,
        isMicOn: p.isMicOn ?? true,
        isCameraOn: p.isCameraOn ?? true,
      }
    })
  }, [participants, peers, localStream])

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
    startMedia,
    stopMedia,
  }
}
