import { useState, useEffect, useMemo, useRef } from "react"
import { useMeeting, useParticipant, usePubSub } from "@videosdk.live/react-sdk"

export const useVideoCall = (shouldJoin = false) => {
  const [messages, setMessages] = useState([])

  // -- VideoSDK Hooks --
  const {
    join,
    leave,
    participants: sdkParticipants,
    localParticipant,
    toggleMic,
    toggleWebcam,
  } = useMeeting({
    onMeetingJoined: () => {
      // console.log("[useVideoCall] Meeting Joined")
    },
    onMeetingLeft: () => {
      // console.log("[useVideoCall] Meeting Left")
    },
  })

  // -- Chat (PubSub) --
  const { publish, messages: pubSubMessages } = usePubSub("CHAT", {
    onMessageReceived: (message) => {
      // console.log("New Message", message)
    },
    onOldMessagesReceived: (messages) => {
      // console.log("Old Messages", messages)
    },
  })

  // Convert PubSub messages to App's format
  useEffect(() => {
    const mapped = pubSubMessages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId, // This is VideoSDK ParticipantId
      senderName: msg.senderName,
      content: msg.message,
      timestamp: msg.timestamp,
      isLocal: msg.senderId === localParticipant?.id,
    }))
    setMessages(mapped)
  }, [pubSubMessages, localParticipant])

  // -- Lifecycle --
  const hasJoinedRef = useRef(false)
  useEffect(() => {
    if (shouldJoin && !hasJoinedRef.current) {
      // Prevent spamming join
      console.log("[useVideoCall] Attempting to join meeting from hooks...")
      hasJoinedRef.current = true
      join()
    }
  }, [shouldJoin, join])

  // -- Helpers to map participants for UI --
  const mappedParticipants = useMemo(() => {
    const participantsArr = []

    if (localParticipant) {
      const { displayName, streams, id } = localParticipant
      const webcamStream = streams.get("webcam")?.track || null
      const micStream = streams.get("mic")?.track || null

      // Create a combined MediaStream for the UI to consume
      let combinedStream = null
      if (webcamStream || micStream) {
        const tracks = []
        if (webcamStream) tracks.push(webcamStream)
        if (micStream) tracks.push(micStream)
        combinedStream = new MediaStream(tracks)
      }

      participantsArr.push({
        id, // VideoSDK ID
        accountId: localParticipant.metaData?.accountId || "local",
        username: displayName,
        isMicOn: localParticipant.micOn,
        isCameraOn: localParticipant.webcamOn,
        stream: combinedStream, // UI expects a MediaStream object
        isActive: true,
        isLocal: true,
      })
    }

    // Remote Participants
    // Filter out duplicate local participant if it appears in remote list or duplicate entries
    // Also ensuring no duplicates in general
    const localId = localParticipant?.id

    Array.from(sdkParticipants.values()).forEach((participant) => {
      // Skip if it is the local user
      if (participant.id === localId) return

      const { displayName, streams, id, metaData } = participant
      const webcamStream = streams.get("webcam")?.track
      const micStream = streams.get("mic")?.track // Check if exists

      let combinedStream = null
      if (webcamStream || micStream) {
        const tracks = []
        if (webcamStream) tracks.push(webcamStream)
        if (micStream) tracks.push(micStream)
        combinedStream = new MediaStream(tracks)
      }

      participantsArr.push({
        id,
        accountId: metaData?.accountId || id, // Fallback
        username: displayName,
        isMicOn: participant.micOn, // property on Participant object
        isCameraOn: participant.webcamOn,
        stream: combinedStream,
        isActive: true,
        isLocal: false,
      })
    })

    return participantsArr
  }, [sdkParticipants, localParticipant])

  // -- Local Media Stream Helper (Separately exposed for Previews) --
  const localMediaStream = useMemo(() => {
    if (localParticipant) {
      const webcamStream = localParticipant.streams.get("webcam")?.track
      const micStream = localParticipant.streams.get("mic")?.track

      if (webcamStream || micStream) {
        const tracks = []
        if (webcamStream) tracks.push(webcamStream)
        if (micStream) tracks.push(micStream)
        return new MediaStream(tracks)
      }
    }
    return null
  }, [localParticipant])

  // -- Actions --

  const sendMessage = (text) => {
    publish(text, { persist: true })
  }

  const toggleAudio = (isEnabled) => {
    if (isEnabled) {
      if (!localParticipant?.micOn) toggleMic()
    } else {
      if (localParticipant?.micOn) toggleMic()
    }
  }

  const toggleVideo = (isEnabled) => {
    if (isEnabled) {
      if (!localParticipant?.webcamOn) toggleWebcam()
    } else {
      if (localParticipant?.webcamOn) toggleWebcam()
    }
  }

  return {
    participants: mappedParticipants,
    messages,
    toggleAudio,
    toggleVideo,
    sendMessage,
    leaveMeeting: leave,
    isConnected: !!localParticipant, // Rough check
    localParticipant, // Exposed for raw access if needed
    localMediaStream,
  }
}
