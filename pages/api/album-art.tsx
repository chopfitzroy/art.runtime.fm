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

    const width = parseInt(searchParams.get('width') ?? '3000');
    const height = parseInt(searchParams.get('height') ?? '3000');
    const title = searchParams.get('title') ?? 'My Default Title';

    return new ImageResponse(
      (
        <div
          tw="flex w-full items-center h-full justify-between"
        >
          <p
            tw="text-6xl leading-tight my-0"
            style={{
              fontFamily: 'Inconsolata',
            }}
          >
            {title}
          </p>
        </div>
      ),
      {
        width,
        height,
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