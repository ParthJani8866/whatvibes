import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #262626 100%)',
          color: 'white',
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>Bio For IG</div>
          <div style={{ fontSize: 34, fontWeight: 600, color: '#d4d4d4' }}>
            Free Instagram tools + SEO keywords
          </div>
        </div>
      </div>
    ),
    size
  )
}
