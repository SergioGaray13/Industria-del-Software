// src/app/terminos/page.tsx

export const metadata = {
    title: 'Términos y Condiciones | Eventualy',
    description: 'Lee los términos y condiciones de uso de Eventualy.',
  };
  
  export default function TerminosPage() {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso</h1>
        <p className="text-sm text-gray-500 mb-10">Última actualización: Julio 2025</p>
  
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Aceptación de los Términos</h2>
            <p>El uso de Eventualy implica la aceptación plena y sin reservas de todos los términos aquí expuestos...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Descripción del Servicio</h2>
            <p>Eventualy es una plataforma all-in-one para la planificación de eventos...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Registro y Cuentas</h2>
            <p>Los usuarios deben registrarse para acceder a ciertas funciones...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Uso Aceptable</h2>
            <p>No está permitido el uso de Eventualy para actividades fraudulentas, ofensivas o ilegales...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Contratación y Pagos</h2>
            <p>Las reservas y pagos se gestionan dentro de la plataforma con condiciones claras...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Propiedad Intelectual</h2>
            <p>Todo el contenido de Eventualy es propiedad intelectual de la plataforma o sus aliados...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Limitación de Responsabilidad</h2>
            <p>No nos responsabilizamos por fallos técnicos o problemas entre usuario y proveedor...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Modificaciones</h2>
            <p>Estos términos pueden ser modificados sin previo aviso. Se recomienda revisarlos periódicamente...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Protección de Datos</h2>
            <p>Consulta nuestra <a href="/privacidad" className="text-blue-600 underline">Política de Privacidad</a> para más información...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">10. Contacto</h2>
            <p>📧 contacto@eventualy.com<br />🌐 www.eventualy.com<br />📍 Tegucigalpa, Honduras</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">11. Legislación Aplicable</h2>
            <p>Estos términos se rigen por las leyes de Honduras...</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">12. Cierre</h2>
            <p>Al aceptar estos términos, formas parte de Eventualy, una comunidad que celebra, conecta y transforma.</p>
          </div>
        </section>
      </main>
    );
  }
  