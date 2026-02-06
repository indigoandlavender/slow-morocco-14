import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Slow Morocco — Transformative Travel'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Subtle texture overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 80,
            right: 80,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: 'flex',
            fontSize: 14,
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
        >
          Cultural Alchemy
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.08em',
            marginBottom: 24,
          }}
        >
          Slow Morocco
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: 'rgba(255,255,255,0.3)',
            }}
          />
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
            }}
          >
            Marrakech
          </div>
          <div
            style={{
              width: 40,
              height: 1,
              background: 'rgba(255,255,255,0.3)',
            }}
          />
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 80,
            right: 80,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
