import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}