// src/app/dashboard/layout.tsx
'use client';

import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import NotificationsDropdown from '@/components/notificaciones/Notifications';
import dynamic from 'next/dynamic';

const ChatBot = dynamic(() => import('@/components/chatbot/ChatBot'), {
  ssr: false,
  loading: () => <div className="text-sm text-orange-500">Cargando Chat...</div>,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 h-screen sticky top-0 border-r bg-white shadow-md">
          <DashboardNavbar />
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {/* Encabezado global */}
          <div className="flex justify-between items-center py-6 px-4 bg-white rounded-xl shadow mb-6 relative">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Eventualy</h1>
              <p className="text-sm text-gray-500">Tu panel de eventos personalizado</p>
            </div>
            <NotificationsDropdown />
          </div>

          {/* Contenido dinámico */}
          {children}
        </main>
      </div>

      {/* ChatBot + Footer */}
      <ChatBot />
      <Footer />
    </div>
  );
}
