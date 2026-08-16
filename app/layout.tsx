import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Orbitron, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'TARDS // BEAMING — Resource Network',
  description:
    'TARDS // BEAMING — a classified personal resource network from the future. A HUD-driven command center for launching your own nodes.',
  generator: 'v0.app',
  applicationName: 'TARDS BEAMING',
  keywords: ['TARDS', 'BEAMING', 'resource network', 'dashboard', 'launcher', 'HUD'],
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0405',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${orbitron.variable} ${geist.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
