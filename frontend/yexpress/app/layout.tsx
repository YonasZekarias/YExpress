import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "react-hot-toast";
import AuthHydrator from "./providers/AuthHyrator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ThemeProvider>
          <div className="min-h-screen w-full">
            <AuthHydrator />

            {/* Full-width wrapper */}
            <main className="w-full">
              {children}
            </main>

            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 4000,
                style: {
                  padding: "16px 20px",
                  borderRadius: "12px",
                  background: "var(--background-toast, #1F2937)",
                  color: "var(--foreground-toast, #F9FAFB)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                },
                success: {
                  style: {
                    background: "#22C55E",
                    color: "#FFFFFF",
                  },
                  icon: "✅",
                },
                error: {
                  style: {
                    background: "#EF4444",
                    color: "#FFFFFF",
                  },
                  icon: "❌",
                },
                loading: {
                  style: {
                    background: "#2563EB",
                    color: "#FFFFFF",
                  },
                  icon: "⏳",
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
