import { useState, useEffect, useRef } from "react"

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
      console.error("[useMediaStream] getUserMedia Error:", err, constraints)
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

const getTrackConstraints = (kind) => {
  if (kind === "audio") return { audio: true, video: false }
  if (kind === "video") return { audio: false, video: true }
  return {}
}

export const useMediaStream = () => {
  const [localStream, setLocalStream] = useState(null)
  const localStreamRef = useRef(null)

  const [isMediaReady, setIsMediaReady] = useState(false)

  useEffect(() => {
    let mounted = true

    acquireMediaStream().then((stream) => {
      if (mounted) {
        if (stream) {
          setLocalStream(stream)
          localStreamRef.current = stream
        }
        setIsMediaReady(true)
      }
    })

    return () => {
      mounted = false
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startMedia = async (kind) => {
    try {
      // 1. Check if we already have this track
      if (localStream && localStream.getTracks().find((t) => t.kind === kind)) {
        return // Already have it
      }

      // 2. Acquire new track
      const newStream = await navigator.mediaDevices.getUserMedia(
        getTrackConstraints(kind)
      )
      const newTrack = newStream.getTracks()[0]

      // 3. Merge with existing stream
      setLocalStream((prev) => {
        const existingTracks = prev ? prev.getTracks() : []
        // Remove any existing track of same kind just in case
        const otherTracks = existingTracks.filter((t) => t.kind !== kind)
        return new MediaStream([...otherTracks, newTrack])
      })
    } catch (err) {
      console.error(`[useMediaStream] Failed to start ${kind}:`, err)
    }
  }

  const stopMedia = (kind) => {
    setLocalStream((prev) => {
      if (!prev) return null
      const tracks = prev.getTracks()
      const targetTrack = tracks.find((t) => t.kind === kind)

      if (targetTrack) {
        targetTrack.stop() // Hardware Stop
        const remainingTracks = tracks.filter((t) => t.kind !== kind)
        if (remainingTracks.length === 0) return null
        return new MediaStream(remainingTracks)
      }
      return prev
    })
  }

  const toggleTrack = (kind, enabled) => {
    if (enabled) {
      startMedia(kind)
    } else {
      stopMedia(kind)
    }
  }

  return {
    localStream,
    localStreamRef,
    toggleTrack,
    startMedia,
    stopMedia,
    isMediaReady,
  }
}
