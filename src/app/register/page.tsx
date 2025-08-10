'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Por favor ingresa tu primer nombre y primer apellido.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      // Insertar siempre con rol 'usuario'
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: 'usuario',  // rol fijo
        },
      ]);
      if (insertError) {
        alert(insertError.message);
        return;
      }
      router.push('/login');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>

      <input
        type="text"
        placeholder="Primer Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        placeholder="Primer Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      {/* Eliminado el select de roles */}

      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Registrarse
      </button>
    </div>
  );
}
