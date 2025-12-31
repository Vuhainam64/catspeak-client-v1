import { useState, useRef, useEffect } from "react"
import * as signalR from "@microsoft/signalr"

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
}

export const useWebRTC = (sessionId, localStream, connection) => {
  const [peers, setPeers] = useState({}) // { [id]: { stream, pc, ... } }
  const peersRef = useRef({})
  const localStreamRef = useRef(localStream)

  // Handle Stream Updates (Track Replacement)
  useEffect(() => {
    // If localStream is null or changed, update all peers
    const stream = localStream // This can be null if all tracks stopped

    Object.keys(peersRef.current).forEach((userId) => {
      const peer = peersRef.current[userId]
      if (peer && peer.peerConnection) {
        const pc = peer.peerConnection
        const senders = pc.getSenders()

        // 1. Helper to find sender for a kind
        const findSender = (kind) =>
          senders.find((s) => s.track && s.track.kind === kind)

        // 2. Audio Handling
        const audioTrack = stream?.getAudioTracks()[0]
        const audioSender = findSender("audio")

        if (audioTrack) {
          if (audioSender) {
            audioSender.replaceTrack(audioTrack).catch(console.error)
          } else {
            // Need to add transceiver if not exists, but usually we init with one.
            // If we added via addTrack, we have a sender.
            // If we started RecvOnly, we might have a transceiver with no track?
            // "addTrack" is safest for simple renegotiation or initial add
            pc.addTrack(audioTrack, stream)
          }
        } else {
          // Track stopped/removed
          if (audioSender) {
            audioSender.replaceTrack(null).catch(console.error)
          }
        }

        // 3. Video Handling
        const videoTrack = stream?.getVideoTracks()[0]
        const videoSender = findSender("video")

        if (videoTrack) {
          if (videoSender) {
            videoSender.replaceTrack(videoTrack).catch(console.error)
          } else {
            pc.addTrack(videoTrack, stream)
          }
        } else {
          if (videoSender) {
            videoSender.replaceTrack(null).catch(console.error)
          }
        }
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

      // Process Queued Candidates
      const queue = peersRef.current[targetId]?.candidatesQueue
      if (queue && queue.length > 0) {
        console.log(
          `[useWebRTC] Processing ${queue.length} queued candidates for ${targetId}`
        )
        for (const candidate of queue) {
          try {
            await pc.addIceCandidate(candidate)
          } catch (e) {
            console.error(
              `[useWebRTC] Error adding queued candidate for ${targetId}:`,
              e
            )
          }
        }
        peersRef.current[targetId].candidatesQueue = []
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
    setPeers({})
  }

  const addIceCandidate = async (targetId, candidate) => {
    const peer = peersRef.current[targetId]
    if (!peer) {
      console.warn(
        `[useWebRTC] Cannot add candidate: Peer ${targetId} not found`
      )
      return
    }

    const pc = peer.peerConnection
    if (!pc.remoteDescription && pc.signalingState !== "stable") {
      console.log(
        `[useWebRTC] Queuing candidate for ${targetId} (no remoteDescription)`
      )
      if (!peer.candidatesQueue) peer.candidatesQueue = []
      peer.candidatesQueue.push(candidate)
    } else {
      try {
        await pc.addIceCandidate(candidate)
      } catch (err) {
        console.error(`[useWebRTC] addIceCandidate Error for ${targetId}:`, err)
      }
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
    addIceCandidate,
  }
}
