'use client'

import { useEffect, useRef } from 'react'
import '@byomakase/omakase-player/dist/style.css'
import type { OmakasePlayer } from '@byomakase/omakase-player' // Type-only import

type Props = {
  streamUrl?: string
  mediaChrome?: 'enabled' | 'disabled' | 'fullscreen-only'
}

export default function OmakasePlayerComponent({
  streamUrl = 'https://demo.player.byomakase.org/data/sdr-ts/meridian_sdr.m3u8',
  mediaChrome = 'enabled',
}: Props) {
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<OmakasePlayer | null>(null)

  useEffect(() => {
    let isMounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const initPlayer = async () => {
      if (!playerContainerRef.current) return

      // Dynamically import the player only in the browser
      const { OmakasePlayer } = await import('@byomakase/omakase-player')

      if (!isMounted) return

      const player = new OmakasePlayer({
        playerHTMLElementId: 'omakase-player',
        mediaChrome,
      })

      playerRef.current = player

      subscription = player.loadVideo(streamUrl).subscribe({
        next: (video) => {
          console.log(
            `Video loaded. Duration: ${video.duration}, totalFrames: ${video.totalFrames}`
          )
        },
        error: (err) => {
          console.error('Video load error:', err)
        },
      })
    }

    initPlayer()

    return () => {
      isMounted = false
      subscription?.unsubscribe()
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [streamUrl, mediaChrome])

  return (
    <div
      id="omakase-player"
      ref={playerContainerRef}
      style={{ width: '100%', aspectRatio: '16 / 9' }}
    />
  )
}