'use client';

import React, { useState } from "react";
import Image from "next/image";

function LandingPage() {
  const [role, setRole] = useState<string | null>(null);

  const handleLogin = (roleValue: string) => {
    if (roleValue === "cliente") {
      window.location.href = "/login";
    } else {
      setRole(roleValue);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#fef6e4", color: "#3d3d3d" }}>
      {/* Barra de navegación */}
      <nav style={{
        backgroundColor: "#ff7f50",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src="/Logo eventualy.png" alt="Logo Eventualy" width={150} height={50} />
        </div>
        <div>
          
          <button
            onClick={() => handleLogin("cliente")}
            style={{
              backgroundColor: "#ffb347",
              border: "none",
              padding: "0.7rem 1.5rem",
              color: "#fff",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#ff9f68"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ffb347"}
          >
            Inicia Sesion
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{
        padding: "3rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap"
      }}>
        {/* Mensajes descriptivos */}
        <div style={{ maxWidth: "300px", textAlign: "left" }}>
          <h2 style={{ color: "#ff7f50" }}>¡Bienvenido a Eventualy!</h2>
          <p>
            La plataforma donde tus sueños de eventos se hacen realidad.  
            Encuentra salones, catering, decoración y todo lo que necesitas para tus celebraciones.  
            Crea experiencias únicas y memorables con nosotros.
          </p>
          <p>
            🎉 Desde bodas hasta reuniones corporativas, nos encargamos de que cada detalle cuente.
          </p>
        </div>

        {/* Carrusel simple */}
        <div style={{
          width: "500px",
          height: "300px",
          overflow: "hidden",
          borderRadius: "15px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
        }}>
          <div style={{
            display: "flex",
            width: "1500px",
            animation: "slide 12s infinite"
          }}>
            <Image src="/carousel1.jpg" alt="Evento 1" width={500} height={300} />
            <Image src="/carousel2.jpg" alt="Evento 2" width={500} height={300} />
            <Image src="/carousel3.jpg" alt="Evento 3" width={500} height={300} />
          </div>
        </div>

        {/* Mensajes adicionales */}
        <div style={{ maxWidth: "300px", textAlign: "left" }}>
          <h2 style={{ color: "#ff7f50" }}>Nuestra promesa</h2>
          <p>
            Nos apasiona ayudarte a crear momentos que perduren para siempre.  
            Con proveedores de confianza y herramientas fáciles de usar,  
            planificar tu evento nunca fue tan sencillo.
          </p>
          <p>
            📅 Reserva rápido, seguro y con total tranquilidad.
          </p>
        </div>
      </main>

      {/* Animaciones */}
      <style>
        {`
          @keyframes slide {
            0% { transform: translateX(0); }
            33% { transform: translateX(-500px); }
            66% { transform: translateX(-1000px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

export default LandingPage;
