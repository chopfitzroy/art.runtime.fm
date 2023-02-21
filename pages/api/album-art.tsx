import type { NextRequest } from 'next/server'

import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
}

const fetchFont = async (url: URL) => {
  const res = await fetch(url);
  return res.arrayBuffer();
};

// @NOTE
// - URL has to be defined inline
// - https://github.com/vercel/community/discussions/1567
const karlaBoldFont = fetchFont(new URL('../../assets/Karla-Bold.ttf', import.meta.url));
const karlaRegularFont = fetchFont(new URL('../../assets/Karla-Regular.ttf', import.meta.url));
const inconsolataBoldFont = fetchFont(new URL('../../assets/Inconsolata-Bold.ttf', import.meta.url));
const inconsolataRegularFont = fetchFont(new URL('../../assets/Inconsolata-Regular.ttf', import.meta.url));

export default async function handler(req: NextRequest) {
  const karlaBoldFontData = await karlaBoldFont;
  const karlaRegularFontData = await karlaRegularFont;
  const inconsolataBoldFontData = await inconsolataBoldFont;
  const inconsolataRegularFontData = await inconsolataRegularFont;

  try {
    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id');
    const size = searchParams.get('size');
    const dimensions = size ? parseInt(size) : 3000;

    if (id === null) {
      throw new Error(`No 'id' found`);
    }

    const recordResp = await fetch(`https://api.coffeeandcode.app/api/collections/tracks/records/${id}`);
    const recordJson = await recordResp.json();


    // @NOTE using relative font's here to cater to size 
    const titleSize = dimensions * 0.075;
    const logoPrefixSize = dimensions * 0.15;
    const logoSuffixSize = dimensions * 0.175;
    const episodeNumberSize = dimensions * 0.05;

    return new ImageResponse(
      (
        <div
          tw="flex flex-col w-full h-full items-center justify-around bg-white"
        >
          <p
            tw="text-black"
            style={{
              fontSize: episodeNumberSize,
              fontFamily: 'Karla',
            }}
          >
            #{recordJson.episode}
          </p>
          <p tw="flex align-center justify-end border-b-2 border-black text-black">
            <span style={{
              fontSize: logoPrefixSize,
              fontFamily: 'Inconsolata',
            }}>
              Runtime
            </span>
            <span 
              tw="font-bold"
              style={{
              fontSize: logoSuffixSize,
              fontFamily: 'Karla',
            }}>
              FM
            </span>
          </p>
          <p
            tw="text-black text-right font-bold"
            style={{
              fontSize: titleSize,
              fontFamily: 'Inconsolata',
            }}
          >
            {recordJson.title}
          </p>
        </div>
      ),
      {
        width: dimensions,
        height: dimensions,
        fonts: [
          {
            name: 'Karla',
            data: karlaBoldFontData,
            style: 'normal',
            weight: 700
          },
          {
            name: 'Karla',
            data: karlaRegularFontData,
            style: 'normal',
            weight: 400
          },
          {
            name: 'Inconsolata',
            data: inconsolataBoldFontData,
            style: 'normal',
            weight: 700
          },
          {
            name: 'Inconsolata',
            data: inconsolataRegularFontData,
            style: 'normal',
            weight: 400
          },
        ],
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}