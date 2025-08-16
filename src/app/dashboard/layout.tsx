//src\app\dashboard\layout.tsx
'use client';

import DashboardNavbar from '@/components/DashboardNavbar';
import NotificationsDropdown from '@/components/notificaciones/Notifications';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const ChatBot = dynamic(() => import('@/components/chatbot/ChatBot'), {
  ssr: false,
  loading: () => <div className="text-sm text-orange-500">Cargando Chat...</div>,
});

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Eventualy',
    subtitle: 'Tu panel de eventos personalizado',
  },
  '/dashboard/categorias': {
    title: 'Crear Categoria',
    subtitle: 'Gestionar Categorias',
  },
  '/dashboard/crear-evento': {
    title: 'Crear Evento',
    subtitle: 'Gestionar eventos',
  },
  '/dashboard/usuarios': {
    title: 'Usuarios Registrados',
    subtitle: 'Gestión de usuarios del sistema',
  },
  '/dashboard/salones': {
    title: 'Salones Disponibles',
    subtitle: 'Administración y reservas de salones',
  },
  '/dashboard/sponsors': {
    title: 'Patrocinadores',
    subtitle: 'Gestión de patrocinadores del evento',
  },
  '/dashboard/proveedor': {
    title: 'Proveedores',
    subtitle: 'Administración de proveedores',
  },
  '/dashboard/soporte': {
    title: 'Soporte',
    subtitle: 'Administración de Soporte',
  },
  '/dashboard/mapa': {
    title: 'Mapa',
    subtitle: 'Administración de Mapa',
  },
  '/dashboard/reservas': {
    title: 'Reservas',
    subtitle: 'Administración de Reservas',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPage = pageInfo[pathname] || { title: '', subtitle: '' };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Barra lateral */}
      <aside className="w-64 h-screen sticky top-0 border-r bg-white shadow-md">
        <DashboardNavbar />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col justify-between">
        <div>
          {/* Encabezado común */}
          {(currentPage.title || currentPage.subtitle) && (
            <div className="flex justify-between items-center py-6 px-4 bg-white rounded-xl shadow mb-6">
              <div>
                <h1 className="text-3xl font-bold text-orange-600">{currentPage.title}</h1>
                <p className="text-sm text-gray-500">{currentPage.subtitle}</p>
              </div>
              <NotificationsDropdown />
            </div>
          )}

          {/* Aquí va el contenido de cada página */}
          {children}
        </div>

        {/* ChatBot flotante */}
        <ChatBot />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
