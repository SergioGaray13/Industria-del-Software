// src/app/privacidad/page.tsx

export const metadata = {
    title: 'Política de Privacidad | Eventualy',
    description: 'Lee cómo protegemos y usamos tus datos personales en Eventualy.',
  };
  
  export default function PrivacidadPage() {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
        <p className="text-sm text-gray-500 mb-10">Última actualización: Julio 2025</p>
  
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introducción</h2>
            <p>
              En Eventualy valoramos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tus datos personales cuando accedes y utilizas nuestros servicios.
            </p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Información que recopilamos</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Datos personales:</strong> nombre, correo electrónico, teléfono, ubicación.</li>
              <li><strong>Datos de uso:</strong> páginas visitadas, interacciones, búsquedas y filtros.</li>
              <li><strong>Datos de pago:</strong> procesados por terceros seguros, como Stripe o servicios equivalentes.</li>
              <li><strong>Contenido generado:</strong> publicaciones en el feed, mensajes, encuestas.</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Cómo usamos tu información</h2>
            <p>Usamos tus datos para:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Personalizar tu experiencia en la plataforma.</li>
              <li>Procesar reservas, pagos y solicitudes.</li>
              <li>Mostrarte servicios y proveedores relevantes.</li>
              <li>Contactarte con notificaciones o asistencia técnica.</li>
              <li>Mejorar la calidad y funcionalidad de Eventualy.</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Compartición de datos</h2>
            <p>
              No vendemos tu información personal. Podemos compartirla únicamente con:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Proveedores de servicios (logística, pagos, soporte).</li>
              <li>Autoridades legales, si es requerido por ley.</li>
              <li>Proveedores contratados por el usuario a través de Eventualy.</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger tus datos, incluyendo cifrado, autenticación y control de acceso. Aun así, ningún sistema es 100% seguro.
            </p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Cookies y tecnologías similares</h2>
            <p>
              Usamos cookies para analizar el uso de la plataforma, recordar tus preferencias y ofrecerte contenido personalizado. Puedes gestionar tus preferencias desde tu navegador.
            </p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Tus derechos</h2>
            <p>
              Como usuario, puedes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Acceder, corregir o eliminar tu información personal.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
              <li>Oponerte al procesamiento con fines de marketing.</li>
              <li>Contactarnos para ejercer tus derechos escribiendo a <strong>privacidad@eventualy.com</strong>.</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Publicaremos cualquier cambio aquí y, si es significativo, te notificaremos directamente.
            </p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política, escríbenos a:
              <br />
              📧 privacidad@eventualy.com
              <br />
              📍 Tegucigalpa, Honduras
            </p>
          </div>
        </section>
      </main>
    );
  }
  