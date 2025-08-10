'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const links = [
  { href: '/dashboard', label: 'Inicio', icon: '/Inicio.webp' },
  { href: '/dashboard/mapa', label: 'Mapa', icon: '/mapa.webp' },
  { href: '/dashboard/feed', label: 'Feed', icon: '/Feed.webp' },
  { href: '/dashboard/eventos', label: 'Mis Eventos', icon: '/Eventos.webp' },
  { href: '/dashboard/crear-evento', label: 'Crear Evento', icon: '/crearevento.svg' },
  { href: '/dashboard/soporte', label: 'Soporte', icon: '/Soporte.webp' },
  { href: '/dashboard/catering', label: 'Catering', icon: '/catering.svg' },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');

        const { data: userData } = await supabase
          .from('users')
          .select('name, full_name')
          .eq('id', session.user.id)
          .single();

        setUserName(userData?.name || userData?.full_name || session.user.email?.split('@')[0] || 'Usuario');
      } else {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="flex flex-col h-full bg-white shadow-lg border-r border-orange-200 w-64">
      {/* Logo y encabezado */}
      <div className="p-6 border-b border-orange-100">
        <h2 className="text-2xl font-bold text-orange-600">Eventualy</h2>
        <p className="text-xs text-gray-500">Panel de control</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                >
                  <div className="w-5 h-5 relative">
                    <Image
                      src={link.icon}
                      alt={link.label}
                      fill
                      sizes="(max-width: 768px) 20px, (max-width: 1200px) 24px, 32px"
                      className="object-contain"
                      priority={isActive}
                    />
                  </div>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Perfil y menú */}
      {isAuthenticated && (
        <div className="p-4 border-t border-orange-100 relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center gap-3 rounded-md p-2 hover:bg-orange-100 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {getInitials(userName)}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 bottom-14 w-full bg-white border border-orange-200 rounded-md shadow-lg z-50 py-2">
              <Link
                href="/dashboard/perfil"
                className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver perfil
              </Link>
              <Link
                href="/dashboard/configuracion"
                className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Configuración
              </Link>
              <Link
                href="/dashboard/mi-cuenta"
                className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi cuenta
              </Link>
              <Link
                href="/dashboard/soporte"
                className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Soporte
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
