//src\app\reset-password\page.tsx - Versión final limpia
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const code = searchParams.get('code');

      if (accessToken && refreshToken && type === 'recovery') {
        await setSessionWithTokens(accessToken, refreshToken);
        return;
      }

      if (code) {
        await exchangeCodeForSession(code);
        return;
      }

      await checkExistingSession();
    };

    initializeSession().finally(() => {
      setIsInitializing(false);
    });
  }, [searchParams]);

  const setSessionWithTokens = async (accessToken: string, refreshToken: string) => {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        setMessage(`Error al establecer sesión: ${error.message}`);
        return;
      }

      if (data.session) {
        setTokenValid(true);
      } else {
        setMessage('No se pudo establecer la sesión.');
      }
    } catch (err) {
      setMessage('Error inesperado al establecer la sesión.');
    }
  };

  const exchangeCodeForSession = async (code: string) => {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setMessage(`Error al intercambiar código: ${error.message}`);
        return;
      }

      if (data.session) {
        setTokenValid(true);
      } else {
        setMessage('No se pudo obtener sesión del código.');
      }
    } catch (err) {
      setMessage('Error inesperado al intercambiar el código.');
    }
  };

  const checkExistingSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setMessage('El enlace de recuperación es inválido o ha expirado.');
        return;
      }

      if (session) {
        setTokenValid(true);
      } else {
        setMessage('El enlace de recuperación es inválido o ha expirado.');
      }
    } catch (err) {
      setMessage('Error al verificar la sesión.');
    }
  };

  const handleChangePassword = async () => {
    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      setLoading(false);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('¡Contraseña cambiada con éxito! Redirigiendo al login...');
        
        await supabase.auth.signOut();
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setLoading(false);
      setMessage('Error inesperado al cambiar la contraseña.');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4 text-orange-600">
            Verificando enlace...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <div className="bg-white p-8 rounded shadow max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center text-orange-600">
            Recuperar contraseña
          </h1>
          
          <p className="text-red-600 text-center mb-6">{message}</p>
          
          <div className="text-center space-y-3">
            <a 
              href="/reset-password-request" 
              className="block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded transition duration-200"
            >
              Solicitar nuevo enlace
            </a>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
          Nueva contraseña
        </h1>

        {message && (
          <div className={`mb-4 p-3 rounded text-center ${
            message.includes('éxito') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            disabled={loading}
          />

          <button
            onClick={handleChangePassword}
            disabled={loading || !password || !confirmPassword}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              'Cambiar contraseña'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-sm text-gray-600 hover:text-orange-600 hover:underline"
          >
            ← Volver al login
          </a>
        </div>
      </div>
    </div>
  );
}
