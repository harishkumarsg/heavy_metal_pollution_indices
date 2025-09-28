import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HMPI Monitor - Heavy Metal Pollution Indices",
  description: "Advanced environmental monitoring system for heavy metal pollution tracking and analysis",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen bg-background">{children}</body>
    </html>
  )
}
