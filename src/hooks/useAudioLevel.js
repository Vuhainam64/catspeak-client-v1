import { useState, useEffect } from "react"

let sharedAudioContext = null

const getAudioContext = () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)()
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume()
  }
  return sharedAudioContext
}

const useAudioLevel = (stream) => {
  const [level, setLevel] = useState(0)

  useEffect(() => {
    if (!stream) {
      setLevel(0)
      return
    }

    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) return

    let analyser
    let source
    let animationFrameId

    const initAudio = () => {
      try {
        const audioContext = getAudioContext()
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8

        source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray)
          const sum = dataArray.reduce((a, b) => a + b, 0)
          const avg = sum / dataArray.length
          setLevel(avg)
          animationFrameId = requestAnimationFrame(updateLevel)
        }
        updateLevel()
      } catch (error) {
        console.error("Error initializing audio context:", error)
      }
    }

    initAudio()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (source) source.disconnect()
      if (analyser) analyser.disconnect()
    }
  }, [stream])

  return level
}

export default useAudioLevel
