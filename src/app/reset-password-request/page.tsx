//src\app\reset-password-request\page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendReset = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Correo enviado. Revisa tu bandeja para continuar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-orange-600">
          Recuperar Contraseña
        </h1>

        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />

        <button
          onClick={handleSendReset}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded transition duration-200"
        >
          {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
        </button>

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        <div className="text-center space-y-3">
            <a 
              href="/login" 
              className="block text-orange-600 hover:underline"
            >
              Volver al login
            </a>
          </div>
      </div>
    </div>
  );
}