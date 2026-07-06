import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";


export const metadata: Metadata = {
  title: "Home — SOM",
  icons: {
    icon: [
      {
        url: "/SOM.icon.png",
        type: "image/png",
      },
    ],
    shortcut: "/SOM.icon.png",
    apple: "/SOM.icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
         <AuthProvider>{children}</AuthProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}