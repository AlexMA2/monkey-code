import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import StoreProvider from "@components/StoreProvider";
import AppLayout from "@components/AppLayout";
import ClerkWrapper from "@components/ClerkWrapper";
import { AuthProvider } from "@/_context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "monkeycode | typing code",
  description: "A minimalist, responsive typing application designed exclusively for developers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${theme}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <StoreProvider>
        <ClerkWrapper>
        <AuthProvider>
        <AppLayout>
        {children}
        </AppLayout>
        </AuthProvider>
        </ClerkWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}