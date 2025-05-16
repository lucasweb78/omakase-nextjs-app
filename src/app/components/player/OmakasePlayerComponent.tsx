'use client'

import { useEffect, useRef, useState } from 'react'
import type { OmakasePlayer } from '@byomakase/omakase-player' // Type-only import
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
    let playSub: any, pauseSub: any, muteSub: any, unmuteSub: any

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
      muteSub = player.video.onVolumeChange$.subscribe(() => setIsMuted(player.video.isMuted()))
    }
    initPlayer()
    return () => {
      isMounted = false
      subscription?.unsubscribe()
      playSub?.unsubscribe?.()
      pauseSub?.unsubscribe?.()
      muteSub?.unsubscribe?.()
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [streamUrl])

  const handlePlayPause = () => {
    const player = playerRef.current
    if (!player) return
    if (player.video.isPaused()) {
      player.video.play().subscribe()
    } else {
      player.video.pause().subscribe()
    }
  }

  const handleMute = () => {
    const player = playerRef.current
    if (!player) return
    if (player.video.isMuted()) {
      player.video.unmute().subscribe()
    } else {
      player.video.mute().subscribe()
    }
  }

  const handleRestart = () => {
    const player = playerRef.current
    if (!player) return
    player.video.seekToTime(0).subscribe(() => {
      player.video.play().subscribe()
    })
  }

  const handleButtonBlur = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="omakase-player"
        ref={playerContainerRef}
        className="omakase-player-container"
      />
      <div className="omakase-controls">
        <button
          onClick={handlePlayPause}
          onMouseUp={handleButtonBlur}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleMute}
          onMouseUp={handleButtonBlur}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button
          onClick={handleRestart}
          onMouseUp={handleButtonBlur}
          aria-label="Restart"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  )
}