import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://leondm.com"),
  title: {
    default: "Leon Di Monte",
    template: "%s · Leon Di Monte",
  },
  description: "Espacio personal y escritos de Leon Di Monte. Ensayos, notas y reflexiones.",
  openGraph: {
    title: "Leon Di Monte",
    description: "Espacio personal y escritos de Leon Di Monte.",
    url: "https://leondm.com",
    siteName: "Leon Di Monte",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
