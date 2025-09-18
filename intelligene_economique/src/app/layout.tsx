import type { Metadata } from "next";
import { PT_Sans, Source_Serif_4, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

// Police du corps: PT Sans (sans-serif, lisible à l'écran)
const bodySans = PT_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Titres et sous-titres: sérif (proche de Joyeux Serif)
const serifHeadings = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intelligence Économique",
  description: "Actualités, analyses, magazines et vidéo-reportages sur l'intelligence économique en Afrique et dans le monde.",
  icons: {
    icon: [
      { url: "/images/IE.png?v=5", type: "image/png", sizes: "16x16" },
      { url: "/images/IE.png?v=5", type: "image/png", sizes: "32x32" },
      { url: "/images/IE.png?v=5", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/images/IE.png?v=5",
    apple: [{ url: "/images/IE.png?v=5", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  {/* Les icônes sont gérées via metadata.icons et le manifest public */}
      </head>
  <body className={`${bodySans.variable} ${serifHeadings.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}>
        <ToastProvider>
          <NavBar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
