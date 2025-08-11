//src\app\dashboard\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setUserRole(userData?.role || null);
    };

    fetchUserRole();
  }, [router]);

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-700">
        Cargando...
      </div>
    );
  }

  const allCategories = [
    { label: 'Salones', icon: '/salones.webp', href: '/dashboard/salones', priority: true },
    { label: 'Proveedores', icon: '/provider.webp', href: '/dashboard/proveedor' },
    { label: 'FAQ', icon: '/FAQ.webp', href: '/dashboard/faq' },
    { label: 'Lugar', icon: '/places.webp', href: '/dashboard/lugar' },
    { label: 'Favoritos', icon: '/Favoritos.webp', href: '/dashboard/favoritos' },
    { label: 'Mis Reservas', icon: '/Reservations.webp', href: '/dashboard/reservas' },
    { label: 'Categorías', icon: '/categorias.webp', href: '/dashboard/categorias' },
    { label: 'ChatBot', icon: '/Chatbot.webp', href: '/dashboard/chatbot' },
  ];

  let categories = [...allCategories];
  if (userRole === 'admin') {
    categories.push({
      label: 'Usuarios',
      icon: '/Users.webp',
      href: '/dashboard/usuarios',
    });
  }
  else {
    categories = categories.filter(cat => cat.label !== 'Categorías' && cat.label !== 'Usuarios');
  }

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none text-sm text-orange-700"
          />
          <div className="w-5 h-5 relative">
            <Image
              src="/buscar.webp"
              alt="Buscar"
              fill
              sizes="(max-width: 768px) 20px, 24px"
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Cuadrícula de categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div
              key={cat.label}
              onClick={() => router.push(cat.href)}
              className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer hover:scale-105 hover:bg-gradient-to-br hover:from-orange-500/80 hover:to-orange-600/90 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-24 h-24 relative mb-2">
                <Image
                  src={cat.icon}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 96px, 120px"
                  className="object-contain rounded-full transition-all duration-300"
                  priority={cat.priority || false}
                  loading={cat.priority ? 'eager' : 'lazy'}
                />
              </div>
              <span className="text-center text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300">
                {cat.label}
              </span>
            </div>
          ))
        ) : (
          <p className="text-orange-500 col-span-full text-center">
            No se encontraron resultados.
          </p>
        )}
      </div>
    </div>
  );
}
