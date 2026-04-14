import { useCallback, useEffect, useRef, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { resolveMediaUrl } from '@/lib/mediaUrl'

interface UseAudioPlayerOptions {
  playErrorMessage: string
}

export function useAudioPlayer({ playErrorMessage }: UseAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null)

  const stopAudio = useCallback(() => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    audioRef.current = null
    setPlayingAudioUrl(null)
  }, [])

  const playAudio = useCallback(async (audioUrl?: string | null) => {
    const resolvedUrl = resolveMediaUrl(audioUrl)
    if (!resolvedUrl) {
      return
    }

    const isSameAudioPlaying = audioRef.current && playingAudioUrl === resolvedUrl
    if (isSameAudioPlaying) {
      stopAudio()
      return
    }

    stopAudio()

    const audio = new Audio(resolvedUrl)
    audioRef.current = audio
    setPlayingAudioUrl(resolvedUrl)

    audio.onended = () => {
      setPlayingAudioUrl(null)
      audioRef.current = null
    }

    audio.onerror = () => {
      setPlayingAudioUrl(null)
      audioRef.current = null
      gooeyToast.error(playErrorMessage)
    }

    try {
      await audio.play()
    } catch {
      setPlayingAudioUrl(null)
      audioRef.current = null
      gooeyToast.error(playErrorMessage)
    }
  }, [playErrorMessage, playingAudioUrl, stopAudio])

  useEffect(() => stopAudio, [stopAudio])

  return {
    playAudio,
    playingAudioUrl,
  }
}
