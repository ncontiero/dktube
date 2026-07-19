import "./globals.css";
import type { Metadata } from "next";

import { ToastContainer } from "react-toastify";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { env } from "@/env";
import { clerkTheme } from "./clerkTheme";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const description = `Aproveite vídeos e músicas que você ama, envie e compartilhe conteúdo original com amigos, parentes e o mundo no ${env.SITE_NAME}.`;
export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_BASEURL),
  title: {
    default: env.SITE_NAME,
    template: `%s • ${env.SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: {
      default: env.SITE_NAME,
      template: `%s • ${env.SITE_NAME}`,
    },
    description,
    siteName: env.SITE_NAME,
    type: "website",
    url: "/",
    locale: env.SITE_LOCALE,
  },
  twitter: {
    title: {
      default: env.SITE_NAME,
      template: `%s • ${env.SITE_NAME}`,
    },
    description,
    card: "summary",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider appearance={{ theme: clerkTheme }} localization={ptBR}>
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={inter.variable}>
          <Providers>
            <AppSidebar />
            <Header />
            <ToastContainer
              autoClose={3000}
              position="top-right"
              theme="dark"
              newestOnTop
              pauseOnFocusLoss={false}
              limit={3}
              stacked
              className="z-999999! bg-background! font-inter! text-foreground!"
              toastClassName="bg-background! text-foreground!"
              progressClassName="bg-primary!"
            />
            <div className="w-full pt-14 sm:pt-16">{children}</div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
