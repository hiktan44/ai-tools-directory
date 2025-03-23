'use client'

import "./globals.css";
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <ThemeProvider>
        <body className={`${inter.className} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors`}>
          <header className="bg-white dark:bg-gray-900 shadow dark:shadow-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-primary dark:text-primary-light">AI Tools Directory</Link>
              
              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span>Admin Paneli</span>
                </Link>
              </div>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-gray-100 dark:bg-gray-900 mt-12 py-8">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
              <p>© 2024 AI Tools Directory. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </body>
      </ThemeProvider>
    </html>
  );
}
