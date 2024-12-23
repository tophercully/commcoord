import type { Metadata } from "next";
import localFont from "next/font/local";
import "./output.css";
import { Analytics } from "@vercel/analytics/next";
import { NotifProvider } from "@/contexts/notificationContext";
import { AuthProvider } from "@/contexts/authContext";

const overusedGrotesk = localFont({
  src: "./fonts/OverusedGrotesk-VF.ttf",
  variable: "--overused-grotesk",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ComCoord",
  description: "Community Coordination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotifProvider>
      <AuthProvider>
        <html lang="en">
          <body
            className={`${overusedGrotesk.className} flex h-fit min-h-[100svh] w-screen flex-col items-center justify-center overflow-y-auto p-4 pt-0 antialiased md:p-10`}
          >
            {children}
            <Analytics />
          </body>
        </html>
      </AuthProvider>
    </NotifProvider>
  );
}
