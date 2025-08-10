import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-6 mt-10 border-t">
      <div className="mb-2">
        © 2025 Eventualy. Todos los derechos reservados.
      </div>

      <div className="mb-2">
        <Link href="/terminos" className="hover:underline mx-2">
          Términos y condiciones
        </Link>
        |
        <Link href="/privacidad" className="hover:underline mx-2">
          Política de privacidad
        </Link>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <a href="https://facebook.com/s" target="_blank" rel="noopener noreferrer">
          <img src="/facebook.svg" alt="Facebook" className="h-6 w-6" />
        </a>
        <a href="https://instagram.com/sergio_garayg" target="_blank" rel="noopener noreferrer">
          <img src="/instagram.svg" alt="Instagram" className="h-6 w-6" />
        </a>
        <a href="https://tiktok.com/chechojathniel" target="_blank" rel="noopener noreferrer">
          <img src="/tiktok.svg" alt="TikTok" className="h-6 w-6" />
        </a>
      </div>
    </footer>
  );
}
