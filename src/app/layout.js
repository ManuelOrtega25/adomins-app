import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import AuthButtons from "@/components/AuthButtons"; //componente de autenticación

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Adomins", 
  description: "Casi todo de Ado...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            
            {/* logo de adomins*/}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/images/adomins.png" 
                alt="Adomins Logo" 
                className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
              />
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-neutral-400">
              <Link href="/albumes" className="hover:text-white transition-colors">
                Álbumes
              </Link>
              
              <Link href="/canciones" className="hover:text-white transition-colors">
                Canciones
              </Link>

              <Link href="/about" className="hover:text-white transition-colors">
                Sobre nosotros
              </Link>
              
              <Link 
                href="/APIexterna" 
                className="hover:text-white transition-colors"
              >
                API externa
              </Link>

              {/*lógica de autenticación/ dinámico de botones dependiendo del tipo de usuario*/}
              <AuthButtons />
            </div>

          </div>
        </nav>

        <main className="w-full">
          {children}
        </main>
        
      </body>
    </html>
  );
}