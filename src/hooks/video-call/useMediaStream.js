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

  const toggleTrack = (kind, enabled) => {
    if (!localStreamRef.current) return
    const tracks =
      kind === "audio"
        ? localStreamRef.current.getAudioTracks()
        : localStreamRef.current.getVideoTracks()

    tracks.forEach((t) => {
      if (t.kind === kind) {
        t.enabled = enabled
      }
    })
  }

  return {
    localStream,
    localStreamRef,
    toggleTrack,
    isMediaReady,
  }
}
