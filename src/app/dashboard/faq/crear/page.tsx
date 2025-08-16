'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface FAQCategory {
  id: number
  name: string
}

export default function CrearFAQ() {
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [categorias, setCategorias] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from('faq_categories')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error al cargar categorías:', error)
      } else {
        setCategorias(data || [])
      }
    }

    fetchCategorias()
  }, [])

  // Guardar FAQ
  const handleGuardar = async () => {
    if (!pregunta.trim() || !respuesta.trim() || !categoriaId) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('faq').insert([
      {
        pregunta,
        respuesta,
        categoria_id: categoriaId,
        embedding: Array(1536).fill(0) // vector vacío por defecto
      }
    ])

    setLoading(false)

    if (error) {
      console.error('Error al guardar FAQ:', error)
      alert('Error al guardar la pregunta frecuente')
    } else {
      alert('FAQ creada con éxito')
      router.push('/dashboard/faq')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          Crear nueva FAQ
        </h1>

        {/* Pregunta */}
        <div className="mb-4">
          <label className="block text-orange-700 font-medium mb-2">
            Pregunta
          </label>
          <input
            type="text"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className="w-full p-3 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Escribe la pregunta"
          />
        </div>

        {/* Respuesta */}
        <div className="mb-4">
          <label className="block text-orange-700 font-medium mb-2">
            Respuesta
          </label>
          <textarea
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            className="w-full p-3 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Escribe la respuesta"
            rows={5}
          />
        </div>

        {/* Categoría */}
        <div className="mb-6">
          <label className="block text-orange-700 font-medium mb-2">
            Categoría
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            className="w-full p-3 border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <button
            onClick={() => router.push('/dashboard/faq')}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar FAQ'}
          </button>
        </div>
      </div>
    </div>
  )
}
