This is an example application to demonstrate issues using [Next.js](https://nextjs.org) with [Omakase Player](https://player.byomakase.org)

## Next.js and Omakase Player Example

This is a simple Next.js application that has been set up to use Client Side Rendering. In imports the Omakase Player and attempts to load a sample [HLS video](https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8).

The application currently surfaces two issues:

1) 'Error initializing OmakasePlayer: TypeError: `crypto.randomUUID` is not a function' when trying to import the '@byomakase/omakase-player' which appears to be caused by the player calling crypto.randomUUID immediately on import.
2) 'video-controller.ts:626 Uncaught TypeError: Cannot read properties of undefined (reading 'addModule')' when instantiating the Omakase Player on line 29 of `/src/apps/components/OmakaseVideoPlayer.tsx`

A workaround for the first error is to monkey patch `crypto.randomUUID` which is done in `/src/apps/components/OmakaseVideoPlayer.tsx` on lines 9-15, you will need to comment these lines out to re-create the first issue 


## Running the Example

Assumes Node 23.11.0 and Next.js 15.3.2, with the example running in the Chrome browser

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
