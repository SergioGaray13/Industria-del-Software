//src\app\login\page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sendingReset, setSendingReset] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/dashboard');
  };

  const handleResetPasswordEmail = async () => {
    if (!email) {
      alert('Por favor ingresa tu correo.');
      return;
    }
    setSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSendingReset(false);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Correo enviado. Revisa tu bandeja para recuperar la contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-100 to-orange-200">
      <main className="flex flex-col items-center justify-center flex-grow px-4">

        {/* Cuadro con fondo de logo */}
        <div
          className="relative bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-8 w-full max-w-md border"
          style={{
            backgroundImage: "url('/Eventualy.webp')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        >
          {/* Capa blanca semitransparente */}
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg" />

          {/* Contenido */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
              Iniciar sesión
            </h1>

            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded transition duration-200"
            >
              Entrar
            </button>

            {/* Botón Olvidé mi contraseña */}
            <a
              href="/reset-password-request"
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 w-full block text-center text-blue-600 hover:underline cursor-pointer"
            >
              Olvidé mi contraseña
            </a>

            <p className="mt-4 text-sm text-center">
              ¿No tienes una cuenta?{' '}
              <a href="/register" className="text-orange-600 hover:underline">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
