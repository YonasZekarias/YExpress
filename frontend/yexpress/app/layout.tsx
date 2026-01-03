import "@/app/globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "react-hot-toast"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen container ">
            {children}
          </main>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
