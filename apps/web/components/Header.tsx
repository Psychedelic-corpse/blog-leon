"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-neutral-800/80 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md transition-colors">
      <nav className="container max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-medium tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity"
        >
          Leon Di Monte
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-normal text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/blog"
            className="text-sm font-normal text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Escritos
          </Link>
          <Link
            href="/imagenes"
            className="text-sm font-normal text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Imágenes
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-neutral-600 dark:text-neutral-300"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] sm:hidden px-6 py-4 space-y-3">
          <Link
            href="/"
            className="block text-sm text-neutral-700 dark:text-neutral-300 py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/blog"
            className="block text-sm text-neutral-700 dark:text-neutral-300 py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Escritos
          </Link>
          <Link
            href="/imagenes"
            className="block text-sm text-neutral-700 dark:text-neutral-300 py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            Imágenes
          </Link>
        </div>
      )}
    </header>
  );
}
