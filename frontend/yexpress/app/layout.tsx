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
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <AuthHydrator />
            <main className="container">{children}</main>
            <Toaster position="bottom-center" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
