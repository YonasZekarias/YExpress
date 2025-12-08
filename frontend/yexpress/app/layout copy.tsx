// @ts-ignore: allow importing global CSS without type declarations
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/landing/navbar"
import { Sidebar } from "@/components/landing/side-bar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "My Ecommerce App",
  description: "Next.js + Shadcn UI + Redis + Express API",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* NAVBAR */}
          <Navbar />

          <div className="flex min-h-screen">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">{children}</main>
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
