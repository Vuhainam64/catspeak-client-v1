import { useEffect, useRef, useState, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
}

export const useVideoCall = (sessionId, user, token) => {
  const [connection, setConnection] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [peers, setPeers] = useState({}) // { userId: { stream, peerConnection, user } }
  const [participants, setParticipants] = useState([]) // List of participants in the session
  const peersRef = useRef({}) // Ref to keep track of peers without triggering re-renders
  const localStreamRef = useRef(null)

  // Initialize Media Stream
  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setLocalStream(stream)
        localStreamRef.current = stream
      } catch (err) {
        console.error('Failed to access media devices:', err)
      }
    }

    startLocalStream()

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

   // Initialize SignalR Connection
  useEffect(() => {
    if (!sessionId || !token || !localStream) return

    const apiUrl = import.meta.env.VITE_API_BASE_URL
    // Strip trailing /api if present to get the root URL for the Hub
    const hubBaseUrl = apiUrl.replace(/\/api\/?$/, '')
    
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubBaseUrl}/hubs/videoChat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)

    return () => {
      if (newConnection) {
        newConnection.stop()
      }
    }
  }, [sessionId, token, localStream])

  // SignalR Event Handlers
  useEffect(() => {
    if (!connection) return

    const handleReceiveOffer = async (sessionId, senderId, offerJson) => {
      console.log('Received Offer from:', senderId)
      const offer = JSON.parse(offerJson)
      await createPeerConnection(senderId, offer)
    }

    const handleReceiveAnswer = async (sessionId, senderId, answerJson) => {
      console.log('Received Answer from:', senderId)
      const answer = JSON.parse(answerJson)
      const peer = peersRef.current[senderId]
      if (peer) {
        await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      }
    }

    const handleReceiveIceCandidate = async (sessionId, senderId, candidateJson) => {
      // console.log('Received ICE Candidate from:', senderId)
      const candidate = JSON.parse(candidateJson)
      const peer = peersRef.current[senderId]
      if (peer) {
        await peer.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      }
    }

    const handleParticipantJoined = (sessionId, participant) => {
        console.log('Participant Joined:', participant)
        setParticipants(prev => {
            if(!prev.find(p => p.accountId === participant.accountId)) {
                return [...prev, participant]
            }
            return prev
        })
        initiateConnection(participant.accountId)
    }

    const handleParticipantLeft = (sessionId, accountId) => {
      console.log('Participant Left:', accountId)
      removePeer(accountId)
      setParticipants(prev => prev.filter(p => p.accountId !== accountId))
    }

    // --- Helper to create PeerConnection ---
    const createPeerConnection = async (userId, remoteOffer = null) => {
      if (peersRef.current[userId]) {
        console.log('Peer already exists for', userId)
        return // Already connected
      }

      console.log('Creating PeerConnection for', userId)
      const pc = new RTCPeerConnection(ICE_SERVERS)

      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current)
        })
      }

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && connection.state === signalR.HubConnectionState.Connected) {
          connection.invoke('SendIceCandidate', parseInt(sessionId), parseInt(userId), JSON.stringify(event.candidate))
            .catch(err => console.error('Error sending ICE:', err));
        }
      }

      // Handle Remote Stream
      pc.ontrack = (event) => {
        console.log('Received remote track from', userId)
        setPeers((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], stream: event.streams[0] },
        }))
      }

      peersRef.current[userId] = { peerConnection: pc }
      setPeers(prev => ({ ...prev, [userId]: { ...prev[userId], peerConnection: pc } }))

      if (remoteOffer) {
        // We received an offer, so we answer
        await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        if (connection.state === signalR.HubConnectionState.Connected) {
             await connection.invoke('SendAnswer', parseInt(sessionId), parseInt(userId), JSON.stringify(answer))
        }
      }

      return pc
    }

    const initiateConnection = async (targetUserId) => {
        const pc = await createPeerConnection(targetUserId)
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke('SendOffer', parseInt(sessionId), parseInt(targetUserId), JSON.stringify(offer))
        }
    }
    
    const removePeer = (userId) => {
        if (peersRef.current[userId]) {
            peersRef.current[userId].peerConnection.close()
            delete peersRef.current[userId]
            setPeers(prev => {
                const newState = { ...prev }
                delete newState[userId]
                return newState
            })
        }
    }

     connection.on('ReceiveOffer', handleReceiveOffer)
    connection.on('ReceiveAnswer', handleReceiveAnswer)
    connection.on('ReceiveIceCandidate', handleReceiveIceCandidate)
    connection.on('ParticipantJoined', handleParticipantJoined)
    connection.on('ParticipantLeft', handleParticipantLeft)

    // Start Connection and Join
    const start = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
             await connection.start()
             console.log('SignalR Connected')
             await connection.invoke('JoinSession', parseInt(sessionId))
        }
      } catch (err) {
        console.error('SignalR Connection Error:', err)
      }
    }

    if (localStream) {
        start()
    }

    return () => {
      connection.off('ReceiveOffer', handleReceiveOffer)
      connection.off('ReceiveAnswer', handleReceiveAnswer)
      connection.off('ReceiveIceCandidate', handleReceiveIceCandidate)
       connection.off('ParticipantJoined', handleParticipantJoined)
      connection.off('ParticipantLeft', handleParticipantLeft)
      
      // Close all peers
      Object.keys(peersRef.current).forEach(uid => {
          peersRef.current[uid].peerConnection.close()
      })
      connection.stop()
    }
  }, [connection, sessionId, localStream]) // Dependencies for binding events

    // Helper to toggle media
    const toggleAudio = (enabled) => {
        if(localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => t.enabled = enabled)
            if(connection && connection.state === signalR.HubConnectionState.Connected) {
                connection.invoke("ToggleAudio", parseInt(sessionId), enabled)
                    .catch(err => console.error("ToggleAudio error", err))
            }
        }
    }

    const toggleVideo = (enabled) => {
        if(localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(t => t.enabled = enabled)
            if(connection && connection.state === signalR.HubConnectionState.Connected) {
                connection.invoke("ToggleVideo", parseInt(sessionId), enabled)
                     .catch(err => console.error("ToggleVideo error", err))
            }
        }
    }

    const sendMessage = (text) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            return connection.invoke("SendMessage", parseInt(sessionId), text)
        }
        return Promise.reject("Connection not ready")
    }


  return {
    connection,
    localStream,
    peers,
    participants,
    toggleAudio,
    toggleVideo,
    sendMessage
  }
}
