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
    const border = dimensions * 0.0025;
    const spacing = dimensions * 0.05;
    const titleSize = dimensions * 0.075;
    const logoPrefixSize = dimensions * 0.15;
    const logoSuffixSize = dimensions * 0.175;
    const episodeNumberSize = dimensions * 0.05;

    return new ImageResponse(
      (
        <div
          tw="flex flex-col w-full h-full items-center justify-around bg-white"
          style={{ padding: spacing }}
        >
          <p
            tw="mr-auto flex items-center"
          >
            <span tw="font-bold"
              style={{
                marginRight: spacing / 2,
                fontSize: episodeNumberSize,
                fontFamily: 'Inconsolata',
              }}>
              Episode
            </span>
            <span tw="inline-block text-white bg-black"
              style={{
                paddingTop: spacing / 4,
                paddingLeft: spacing / 2,
                paddingRight: spacing / 2,
                paddingBottom: spacing / 4,
                fontFamily: 'Karla',
                fontSize: episodeNumberSize,
              }}>
              #{recordJson.episode}
            </span>
          </p>
          <p tw="flex items-end text-black border-black"
            style={{
              transform: 'rotate(-2deg)',
              marginBottom: spacing,
              borderBottomWidth: border
            }}>
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
            tw="ml-auto text-black text-right"
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