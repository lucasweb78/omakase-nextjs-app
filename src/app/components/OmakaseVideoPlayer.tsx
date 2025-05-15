'use client';

import { useEffect, useRef } from 'react';

export default function OmakaseVideoPlayer() {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 🧩 Monkey-patch for crypto.randomUUID if missing, comment this out to recreate the issue
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID !== 'function'
    ) {
      (crypto as any).randomUUID = () => generateFallbackUUID();
    }

    let player: any;

    async function setupPlayer() {
      try {
        const omakase = await import('@byomakase/omakase-player');
        if (!omakase?.OmakasePlayer) {
          console.error('Failed to load OmakasePlayer class');
          return;
        }

        if (!playerRef.current) return;

        player = new omakase.OmakasePlayer({
          playerHTMLElementId: 'omakase-player-root',
          mediaChrome: 'enabled',
        });

        player.loadVideo('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8');
      } catch (err) {
        console.error('Error initializing OmakasePlayer:', err);
      }
    }

    setupPlayer();

    return () => {
      if (player?.destroy) player.destroy();
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        id="omakase-player-root"
        ref={playerRef}
        style={{ width: '100%', aspectRatio: '16/9' }}
      />
    </div>
  );
}

function generateFallbackUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}