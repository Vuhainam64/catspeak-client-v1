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
      console.log("[useVideoCall] Meeting Joined")
    },
    onMeetingLeft: () => {
      console.log("[useVideoCall] Meeting Left")
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
    // Map VideoSDK messages to our format
    // VideoSDK Message: { id, message, senderId, senderName, timestamp, topic }
    // App Format: { id, senderId, content, timestamp, type? }

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
  useEffect(() => {
    if (shouldJoin) {
      join()
    }
  }, [shouldJoin, join])

  // -- Helpers to map participants for UI --
  const mappedParticipants = useMemo(() => {
    const participantsArr = []

    // Add Local if exists (VideoSDK includes local in 'participants' Map usually?
    // Docs: "participants" returns Map of *remote* participants. "localParticipant" is separate.)
    // Wait, let's double check. `useMeeting().participants` is a Map of `participantId` -> `Participant` object.
    // Usually it contains all joined participants EXCEPT local (in some versions) or ALL.
    // Checking docs: "participants: Map<string, Participant>" - "List of all Joined Participants."
    // But typically React SDK separates `localParticipant`.

    if (localParticipant) {
      const { displayName, streams, id } = localParticipant
      // Extract MediaStream from streams map if needed
      // streams: Map<string, Stream>
      const webcamStream = streams.get("webcam")?.track || null
      const micStream = streams.get("mic")?.track || null

      participantsArr.push({
        id, // VideoSDK ID
        accountId: localParticipant.metaData?.accountId || "local",
        username: displayName,
        isMicOn: !!micStream, // OR use localParticipant.micOn
        isCameraOn: !!webcamStream,
        stream: webcamStream ? new MediaStream([webcamStream]) : null, // UI likely expects a MediaStream object
        isActive: true,
        isLocal: true,
      })
    }

    // Remote Participants
    sdkParticipants.forEach((participant) => {
      const { displayName, streams, id, metaData } = participant
      const webcamStream = streams.get("webcam")?.track
      const micStream = streams.get("mic")?.track // Check if exists

      participantsArr.push({
        id,
        accountId: metaData?.accountId || id, // Fallback
        username: displayName,
        isMicOn: participant.micOn, // property on Participant object
        isCameraOn: participant.webcamOn,
        stream: webcamStream ? new MediaStream([webcamStream]) : null,
        isActive: true,
        isLocal: false,
      })
    })

    return participantsArr
  }, [sdkParticipants, localParticipant])

  // -- Actions --

  const sendMessage = (text) => {
    publish(text, { persist: true })
  }

  const toggleAudio = (isEnabled) => {
    if (isEnabled) {
      // If expecting "true" to enable, but toggleMic() just toggles?
      // VideoSDK `toggleMic` just toggles current state.
      // So if we want to force ENABLE, we should check state.
      // But `toggleMic` logic: if muted, unmute.
      // Assuming the UI state `micOn` matches reality, we can just call toggle.
      // Better: Check `localParticipant.micOn`
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
  }
}
