// src\app\dashboard\catering\page.tsx

import Image from "next/image";
import React from "react";

export default function CateringPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto scroll-smooth">
      <div className="flex items-center gap-4 mb-8">
        <Image src="/Eventualy.webp" alt="Logo de Eventualy" width={48} height={48} />
        <h1 className="text-3xl font-bold text-orange-600">Servicios de Catering</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="py-4">
          <h2 className="text-xl font-semibold mb-2 text-orange-500">Tabla de Contenidos</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li><a href="#tipos" className="hover:text-orange-600">Tipos más comunes de catering</a></li>
            <li><a href="#buffet" className="hover:text-orange-600">Catering tipo buffet</a></li>
            <li><a href="#coctel" className="hover:text-orange-600">Catering tipo cóctel</a></li>
            <li><a href="#desayuno" className="hover:text-orange-600">Catering de desayuno / café</a></li>
            <li><a href="#aperitivo" className="hover:text-orange-600">Catering tipo aperitivo o vino español</a></li>
            <li><a href="#brunch" className="hover:text-orange-600">Catering tipo brunch</a></li>
            <li><a href="#banquete" className="hover:text-orange-600">Catering tipo banquete</a></li>
            <li><a href="#movil" className="hover:text-orange-600">Servicios de catering móvil</a></li>
            <li><a href="#hogar" className="hover:text-orange-600">Servicios de catering en el hogar</a></li>
            <li><a href="#puerta" className="hover:text-orange-600">Servicios de catering puerta a puerta</a></li>
            <li><a href="#eventos" className="hover:text-orange-600">Catering para eventos especiales</a></li>
            <li><a href="#corporativo" className="hover:text-orange-600">Catering corporativo</a></li>
            <li><a href="#industrial" className="hover:text-orange-600">Catering industrial</a></li>
          </ul>
        </CardContent>
      </Card>

      <ScrollArea className="h-[70vh] pr-2">
        <div className="space-y-6 text-gray-800 text-sm">
          <p>
            Una empresa de catering se encarga de organizar un servicio de alimentación que consiste en preparar, presentar y servir alimentos en un evento. Todo esto implica logística según el tipo de evento, el horario y el presupuesto. Existen distintos tipos de catering y es importante conocerlos para elegir el que mejor se adapte a las necesidades del cliente.
          </p>

          <Separator />
          <Section title="Tipos más comunes de catering" id="tipos" />

          <Section title="Catering tipo buffet" id="buffet">
            Se utiliza principalmente en grandes eventos corporativos donde existe una alta segmentación entre los invitados, por lo que la mejor opción es ofrecerles una variedad de alimentos que les permita probar las combinaciones que más les apetezcan. Normalmente ofrece una variedad de platos fríos, calientes, dulces y salados, dispuestos en la mesa y de libre acceso para el comensal.
          </Section>

          <Section title="Catering tipo cóctel" id="coctel">
            Se utiliza en eventos informales donde se desea ofrecer un aperitivo para animar el ambiente y fomentar la interacción entre los invitados. Suelen servirse a la hora del almuerzo o la cena y ofrecen entre 15 y 25 bocados salados por persona. Es un servicio muy común en bodas durante la recepción, donde se deleita a los invitados con un surtido de pequeños bocados que sirven como entrada antes del banquete.
          </Section>

          <Section title="Catering de desayuno / café" id="desayuno">
            Para eventos que se realizan por la mañana, se suele optar por ofrecer un café de bienvenida antes de comenzar la reunión y una pausa para el café más consistente a media mañana. Este tipo de catering suele emplearse en eventos empresariales y reuniones corporativas. En este caso, la oferta tiende a ser más dulce y ligera.
          </Section>

          <Section title="Catering tipo aperitivo o vino español" id="aperitivo">
            Se sirve al finalizar una reunión que termina antes del horario de almuerzo o al final de la tarde, como un detalle para los asistentes, una forma de cierre del evento para compartir impresiones entre los presentes. No suele durar más de 45 minutos y generalmente no excede de 6 a 8 bocados salados.
          </Section>

          <Section title="Catering tipo brunch" id="brunch">
            Esta modalidad está muy de moda actualmente y consiste en combinar platos que normalmente se consumen en el desayuno y el almuerzo. Ofrece una gama de opciones accesibles que pueden ser tanto dulces como saladas.
          </Section>

          <Section title="Catering tipo banquete" id="banquete">
            Presente en eventos de mayor duración donde todos los invitados están sentados en la mesa para comer. Es un menú mucho más elaborado que consiste en una entrada, un plato principal y un postre. Ejemplo: Bodas o galas formales.
          </Section>

          <Separator />

          <Section title="Servicios de catering móvil" id="movil">
            Como su nombre indica, consiste en equipos que pueden trasladarse a cualquier lugar y que permiten prestar el servicio de catering en espacios que no cuentan con instalaciones para ello. Suele ser un servicio rápido y sin recetas elaboradas. Ejemplo: Ferias, festivales, etc.
          </Section>

          <Section title="Servicios de catering en el hogar" id="hogar">
            Este tipo de servicio consiste en entregar la comida al cliente en un formato de fácil acceso. La comida suele estar empaquetada de manera que sea fácil de almacenar y servir. El menú puede variar desde algo muy simple hasta recetas más elaboradas. Ejemplo: Fiestas o reuniones en casa.
          </Section>

          <Section title="Servicios de catering puerta a puerta" id="puerta">
            Este servicio se entrega en el hogar y consiste en un menú previamente elegido por el cliente listo para consumir. Para realizar este servicio, debe establecerse una hora específica a la que el proveedor entregará la comida.
          </Section>

          <Section title="Catering para eventos especiales" id="eventos">
            Un evento especial suele incluir todos los servicios necesarios. El proveedor de catering no solo propondrá un menú delicioso, sino que también sugerirá su presentación e incluso, en muchos casos, la decoración y planificación general del evento.
          </Section>

          <Section title="Catering corporativo" id="corporativo">
            Este servicio está diseñado para cualquier tipo de evento que pueda realizar una empresa. Su menú puede variar desde algo muy simple hasta algo más elaborado y personalizado, todo depende del perfil del cliente. Ejemplo: Reuniones de negocios, sesiones de capacitación, etc.
          </Section>

          <Section title="Catering industrial" id="industrial">
            Se considera industrial cuando el número de comensales es bastante alto y el menú, aunque de alta calidad, está estandarizado. Generalmente son pedidos estables que se repiten periódicamente para diferentes eventos dentro de una misma organización. Ejemplo: Hospitales, escuelas, aerolíneas, etc
          </Section>
        </div>
      </ScrollArea>
    </div>
  );
}

function Section({ title, id, children }: { title: string; id: string; children?: React.ReactNode }) {
  return (
    <div id={id}>
      <h3 className="text-lg font-semibold text-orange-500 mb-1">{title}</h3>
      {children && <p className="text-sm text-gray-700 leading-relaxed">{children}</p>}
    </div>
  );
}

// Resto de componentes sin cambios
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-300 shadow-sm bg-white ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Separator() {
  return <hr className="my-4 border-gray-300" />;
}

function ScrollArea({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`overflow-auto ${className}`}>{children}</div>;
}
