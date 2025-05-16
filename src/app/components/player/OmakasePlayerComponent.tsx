'use client'

import { useEffect, useRef, useState } from 'react'
import type { OmakasePlayer } from '@byomakase/omakase-player'
import './OmakasePlayerComponent.css'
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react'

type Props = {
  streamUrl?: string
}

export default function OmakasePlayerComponent({
  streamUrl = 'https://demo.player.byomakase.org/data/sdr-ts/meridian_sdr.m3u8'
}: Props) {
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<OmakasePlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    let isMounted = true
    let subscription: { unsubscribe: () => void } | null = null
    let playSub: any, pauseSub: any, muteSub: any

    const unsubscribe = (sub: any) => sub?.unsubscribe?.()

    const initPlayer = async () => {
      if (!playerContainerRef.current) return

      const { OmakasePlayer } = await import('@byomakase/omakase-player')
      if (!isMounted) return

      const player = new OmakasePlayer({
        playerHTMLElementId: 'omakase-player',
        mediaChrome: 'disabled',
      })

      playerRef.current = player

      subscription = player.loadVideo(streamUrl).subscribe({
        next: () => {
          setIsPlaying(player.video.isPlaying())
          setIsMuted(player.video.isMuted())
        },
        error: (err) => {
          console.error('Video load error:', err)
        },
      })

      playSub = player.video.onPlay$.subscribe(() => setIsPlaying(true))
      pauseSub = player.video.onPause$.subscribe(() => setIsPlaying(false))
      muteSub = player.video.onVolumeChange$.subscribe(() =>
        setIsMuted(player.video.isMuted())
      )
    }

    initPlayer()

    return () => {
      isMounted = false
      unsubscribe(subscription)
      unsubscribe(playSub)
      unsubscribe(pauseSub)
      unsubscribe(muteSub)
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [streamUrl])

  const playerActions = {
    playPause: () => {
      const player = playerRef.current
      if (!player) return
      player.video[player.video.isPaused() ? 'play' : 'pause']().subscribe()
    },
    toggleMute: () => {
      const player = playerRef.current
      if (!player) return
      player.video[player.video.isMuted() ? 'unmute' : 'mute']().subscribe()
    },
    restart: () => {
      const player = playerRef.current
      if (!player) return
      player.video.seekToTime(0).subscribe(() => {
        player.video.play().subscribe()
      })
    }
  }

  const handleButtonBlur = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()
  }

  return (
    <div className="omakase-player-wrapper">
      <div
        id="omakase-player"
        ref={playerContainerRef}
        className="omakase-player-container"
      />
      <div className="omakase-controls">
        <button
          onClick={playerActions.playPause}
          onMouseUp={handleButtonBlur}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={playerActions.toggleMute}
          onMouseUp={handleButtonBlur}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button
          onClick={playerActions.restart}
          onMouseUp={handleButtonBlur}
          aria-label="Restart"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  )
}