import { useState, useRef, useEffect } from "react"
import * as signalR from "@microsoft/signalr"

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
}

export const useWebRTC = (sessionId, localStream, connection) => {
  const [peers, setPeers] = useState({}) // { [id]: { stream, pc, ... } }
  const peersRef = useRef({})
  const localStreamRef = useRef(localStream)

  // Keep ref in sync
  useEffect(() => {
    localStreamRef.current = localStream
  }, [localStream])

  // Late Stream Attachment (if stream arrives after connection)
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

  const createPeerConnection = async (targetId, remoteOffer = null) => {
    console.log(`[useWebRTC] createPeerConnection for ${targetId}`, {
      hasOffer: !!remoteOffer,
      exists: !!peersRef.current[targetId],
    })

    // If peer exists, we might be renegotiating (receiving an offer on existing connection)
    // OR we might be incorrectly trying to double-create.
    let pc
    if (peersRef.current[targetId]) {
      if (remoteOffer) {
        console.log(
          `[useWebRTC] Handling Offer on EXISTING connection for ${targetId}`
        )
        pc = peersRef.current[targetId].peerConnection
      } else {
        console.warn(
          `[useWebRTC] Connection already exists for ${targetId}, skipping creation.`
        )
        return null // Already exists and we are not processing an incoming offer
      }
    } else {
      // Create new PC
      pc = new RTCPeerConnection(ICE_SERVERS)

      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          // Check if track already added (for robustness)
          const senders = pc.getSenders()
          if (!senders.find((s) => s.track === track)) {
            pc.addTrack(track, localStreamRef.current)
          }
        })
      } else {
        // Receive Only Mode: failed to get camera, but we still want to SEE/HEAR others.
        console.log(
          `[useWebRTC] No local stream. Adding recvonly transceivers for ${targetId}`
        )
        pc.addTransceiver("audio", { direction: "recvonly" })
        pc.addTransceiver("video", { direction: "recvonly" })
      }

      // Handle ICE
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // console.log(`[useWebRTC] ICE Candidate generated for ${targetId}`)
          if (connection?.state === signalR.HubConnectionState.Connected) {
            connection
              .invoke(
                "SendIceCandidate",
                parseInt(sessionId),
                parseInt(targetId),
                JSON.stringify(event.candidate)
              )
              .catch((err) => console.error("SendIceCandidate Error:", err))
          } else {
            console.warn(
              `[useWebRTC] Cannot send ICE candidate: SignalR not connected`
            )
          }
        }
      }

      pc.oniceconnectionstatechange = () => {
        console.log(
          `[useWebRTC] ICE Connection State for ${targetId}: ${pc.iceConnectionState}`
        )
      }

      pc.onsignalingstatechange = () => {
        console.log(
          `[useWebRTC] Signaling State for ${targetId}: ${pc.signalingState}`
        )
      }

      pc.onconnectionstatechange = () => {
        console.log(
          `[useWebRTC] Connection State for ${targetId}: ${pc.connectionState}`
        )
      }

      // Handle Stream
      pc.ontrack = (event) => {
        console.log(
          `[useWebRTC] OnTrack received for ${targetId}`,
          event.streams[0]?.id,
          event.track.kind
        )
        setPeers((prev) => {
          const newPeers = {
            ...prev,
            [targetId]: { ...prev[targetId], stream: event.streams[0] },
          }
          console.log(
            `[useWebRTC] Updated peers state for ${targetId}`,
            newPeers
          )
          return newPeers
        })
      }

      // Store PC
      peersRef.current[targetId] = { peerConnection: pc }
      setPeers((prev) => ({
        ...prev,
        [targetId]: { ...prev[targetId], peerConnection: pc },
      }))
    }

    // Handle Offer if provided (Answer)
    if (remoteOffer) {
      try {
        console.log(
          `[useWebRTC] Setting Remote Description (Offer) for ${targetId}`
        )
        await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer))

        console.log(`[useWebRTC] Creating Answer for ${targetId}`)
        const answer = await pc.createAnswer()

        await pc.setLocalDescription(answer)

        if (connection?.state === signalR.HubConnectionState.Connected) {
          console.log(`[useWebRTC] Sending Answer to ${targetId}`)
          await connection.invoke(
            "SendAnswer",
            parseInt(sessionId),
            parseInt(targetId),
            JSON.stringify(answer)
          )
        } else {
          console.error(`[useWebRTC] Cannot send Answer: SignalR Disconnected`)
        }
      } catch (err) {
        console.error(
          `[useWebRTC] Error handling remote offer for ${targetId}:`,
          err
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

    if (connection?.state === signalR.HubConnectionState.Connected) {
      await connection.invoke(
        "SendOffer",
        parseInt(sessionId),
        parseInt(targetId),
        JSON.stringify(offer)
      )
    }
  }

  const closePeerConnection = (targetId) => {
    if (peersRef.current[targetId]) {
      peersRef.current[targetId].peerConnection.close()
      delete peersRef.current[targetId]
      setPeers((prev) => {
        const next = { ...prev }
        delete next[targetId]
        return next
      })
    }
  }

  const closeAllConnections = () => {
    Object.keys(peersRef.current).forEach((uid) => {
      peersRef.current[uid].peerConnection.close()
    })
    peersRef.current = {}
    setPeers({})
  }

  return {
    peers,
    peersRef,
    createPeerConnection,
    initiateConnection,
    closePeerConnection,
    closeAllConnections,
  }
}
