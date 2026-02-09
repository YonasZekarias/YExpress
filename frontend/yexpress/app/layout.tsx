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
            <main className="w-full">{children}</main>

            <Toaster
              position="bottom-right" // "top-center" is also a good professional choice
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 4000,
                // Default styling for all toasts
                className:
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg",
                style: {
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  maxWidth: "400px",
                  // We rely on className for colors to support Dark Mode automatically,
                  // but we set base styles here just in case Tailwind misses.
                  background: "#fff",
                  color: "#333",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                },

                // Custom Success State
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10B981", // Emerald-500
                    secondary: "#fff",
                  },
                  style: {
                    borderLeft: "4px solid #10B981", // Subtle green accent on left
                  },
                },

                // Custom Error State
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#EF4444", // Red-500
                    secondary: "#fff",
                  },
                  style: {
                    borderLeft: "4px solid #EF4444", // Subtle red accent on left
                  },
                },

                // Custom Loading State
                loading: {
                  style: {
                    borderLeft: "4px solid #3B82F6", // Blue accent
                  },
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
