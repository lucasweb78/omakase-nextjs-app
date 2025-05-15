'use client'

import dynamic from 'next/dynamic';

const OmakaseVideoPlayer = dynamic(() => import('@/app/components/OmakaseVideoPlayer'), {
  ssr: false,
});

export default function Page() {
  return (
    <main>
      <h1>Omakase Video Player</h1>
      <OmakaseVideoPlayer />
    </main>
  );
}