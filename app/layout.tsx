import './globals.css'

export const metadata = {
  title: 'Our Story',
  description: 'Daily questions for couples',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
