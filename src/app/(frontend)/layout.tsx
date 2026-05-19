import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Urban Kit – Method Archive',
  description: 'A collection of methods and tools for urban projects.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Urban Kit
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                All Methods
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Saved</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
            Urban Kit Method Archive
          </div>
        </footer>
      </body>
    </html>
  )
}
