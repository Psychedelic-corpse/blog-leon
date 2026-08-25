import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#0a0a0a] transition-colors mt-20">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <Link
              href="/"
              className="text-base font-medium text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity"
            >
              Leon Di Monte
            </Link>
            <p className="mt-1 text-xs italic text-neutral-500 dark:text-neutral-400">
              «El núcleo del hombre yace nacarado y soluble»
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-neutral-500 dark:text-neutral-400">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Inicio
            </Link>
            <Link href="/blog" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Escritos
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row justify-between text-xs text-neutral-400 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} Leon Di Monte. Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">leondm.com</p>
        </div>
      </div>
    </footer>
  );
}
