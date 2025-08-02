import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'FileShare - P2P File Sharing',
    description: 'Securely share files peer-to-peer',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.png" type="image/png" />
        </head>
        <body className="bg-slate-50 relative overflow-hidden">
        {/* Silk Animated Background */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-white to-pink-100 opacity-50 animate-backgroundWave" />
            <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e0e7ff" />
                        <stop offset="100%" stopColor="#fce7f3" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,100 C300,200 600,0 900,100 L900,300 L0,300 Z"
                    fill="url(#silkGradient)"
                >
                    <animate
                        attributeName="d"
                        dur="10s"
                        repeatCount="indefinite"
                        values="
                  M0,100 C300,200 600,0 900,100 L900,300 L0,300 Z;
                  M0,120 C300,180 600,20 900,120 L900,300 L0,300 Z;
                  M0,100 C300,200 600,0 900,100 L900,300 L0,300 Z
                "
                    />
                </path>
            </svg>
        </div>

        <main className="relative min-h-screen backdrop-blur-sm">
            {children}
        </main>
        </body>
        </html>
    );
}

