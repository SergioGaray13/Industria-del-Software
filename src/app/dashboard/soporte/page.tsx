'use client'

import { useState } from 'react'
import { guardarMensajeDeSoporte } from '@/lib/supabase'
import { enviarCorreoDeSoporte } from '@/lib/email'

export default function SoportePage() {
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sugerencias = [
    'No puedo acceder a mi cuenta.',
    'Encontré un error al crear un evento.',
    '¿Cómo puedo eliminar un evento?',
    '¿Pueden agregar una opción para editar eventos?',
    '¿Dónde veo mis eventos pasados?',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setEnviado(false)

    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }

    if (mensaje.trim().length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres.')
      return
    }

    try {
      await guardarMensajeDeSoporte(nombre, mensaje)

      try {
        await enviarCorreoDeSoporte(nombre, mensaje)
      } catch (correoError: any) {
        console.warn('Correo no enviado (continuando sin error fatal):', correoError.message || correoError)
      }

      setEnviado(true)
      setNombre('')
      setMensaje('')
    } catch (error: any) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : typeof error === 'object'
          ? JSON.stringify(error, null, 2)
          : String(error)

      console.error('Error al enviar soporte:', mensajeError)
      setError('Hubo un problema al enviar tu mensaje. Intenta nuevamente.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Soporte</h1>

      {enviado && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          ¡Tu mensaje ha sido enviado con éxito!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <textarea
          placeholder="Escribe tu mensaje de soporte aquí..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={5}
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          Enviar mensaje
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Sugerencias de mensaje:</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {sugerencias.map((sugerencia, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-orange-600"
              onClick={() => setMensaje(sugerencia)}
            >
              {sugerencia}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
