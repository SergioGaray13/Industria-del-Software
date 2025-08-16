'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import ChatBot from '@/components/chatbot/ChatBot'

interface FAQ {
  id: string
  pregunta: string
  respuesta: string
  categoria?: string
  created_at: string
  updated_at?: string
}

interface FAQCategory {
  name: string
  icon: string
  count: number
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserRoleAndFAQs = async () => {
      try {
        setError(null)

        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Error de sesión:', sessionError)
          setError('Error al verificar la sesión')
          return
        }

        if (!session) {
          router.push('/login')
          return
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (userError) {
          console.error('Error al obtener datos del usuario:', userError)
        }

        setUserRole(userData?.role || null)

        const { data: catData, error: catError } = await supabase
          .from('faq_categories')
          .select('name, icon')

        if (catError) {
          console.error('Error al cargar categorías:', catError)
        } else {
          setCategories([
            { name: 'todas', icon: '📋', count: 0 },
            ...(catData || []).map(c => ({ ...c, count: 0 }))
          ])
        }

        const { data: faqData, error: faqError } = await supabase
          .from('faq')
          .select(`
            id,
            pregunta,
            respuesta,
            created_at,
            updated_at,
            categoria:faq_categories(name)
          `)
          .order('created_at', { ascending: false })

        if (faqError) {
          console.error('Error al cargar FAQs:', faqError)
          setError(`Error al cargar preguntas frecuentes: ${faqError.message}`)
        } else {
          const mappedFaqs = (faqData || []).map((f: any) => ({
            ...f,
            categoria: f.categoria?.name || null
          }))
          setFaqs(mappedFaqs)

          const updatedCats = (catData || []).map(cat => ({
            ...cat,
            count: mappedFaqs.filter(f => f.categoria?.toLowerCase() === cat.name.toLowerCase()).length
          }))
          setCategories(prev => [
            { name: 'todas', icon: '📋', count: mappedFaqs.length },
            ...updatedCats
          ])
        }
      } catch (error) {
        console.error('Error inesperado:', error)
        setError('Error inesperado al cargar las preguntas frecuentes')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRoleAndFAQs()
  }, [router])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch =
      faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'todas' ||
      faq.categoria?.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleAddFAQ = () => {
    router.push('/dashboard/faq/crear')
  }

  const handleEditFAQ = (faqId: string) => {
    router.push(`/dashboard/faq/editar/${faqId}`)
  }

  const retryLoad = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 text-xl font-medium">Cargando preguntas frecuentes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={retryLoad}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Image src="/back-arrow.png" alt="Volver" width={24} height={24} className="w-6 h-6" />
          </button>
          <div className="text-2xl font-bold text-orange-600">
            Preguntas Frecuentes ({faqs.length})
          </div>
        </div>

        {/* Botón para agregar FAQ (solo admin) */}
        {userRole === 'admin' && (
          <button
            onClick={handleAddFAQ}
            className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors shadow-md flex items-center"
          >
            <span className="mr-2">➕</span>
            Nueva FAQ
          </button>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            placeholder="Buscar en preguntas y respuestas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none text-sm text-orange-700"
          />
          <Image src="/buscar.png" alt="Buscar" width={20} height={20} />
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-orange-600 mb-3">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-orange-700 hover:bg-orange-50 shadow-md'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              <span className="ml-2 bg-orange-100 text-orange-800 rounded-full px-2 py-0.5 text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de FAQs */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Pregunta */}
              <div
                onClick={() => toggleFAQ(faq.id)}
                className="p-6 cursor-pointer hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">❓</span>
                      <h3 className="text-lg font-semibold text-orange-700">
                        {faq.pregunta}
                      </h3>
                    </div>
                    {faq.categoria && (
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                        {faq.categoria.charAt(0).toUpperCase() + faq.categoria.slice(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {userRole === 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditFAQ(faq.id)
                        }}
                        className="mr-3 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        title="Editar pregunta"
                      >
                        ✏️
                      </button>
                    )}
                    <div
                      className={`transform transition-transform ${
                        expandedFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                    >
                      <Image src="/expandir.webp" alt="Expandir" width={20} height={20} title="Expandir"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Respuesta */}
              {expandedFAQ === faq.id && (
                <div className="px-6 pb-6 border-t border-orange-100">
                  <div className="flex items-start mt-4">
                    <span className="text-2xl mr-3 mt-1">💡</span>
                    <div className="flex-1">
                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-300">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {faq.respuesta}
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Creado:{' '}
                        {new Date(faq.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {faq.updated_at && faq.updated_at !== faq.created_at && (
                          <span className="ml-4">
                            Actualizado:{' '}
                            {new Date(faq.updated_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-orange-300 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-orange-600 mb-2">
              No se encontraron preguntas
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'todas'
                ? `No hay preguntas que coincidan con los filtros aplicados`
                : 'No hay preguntas frecuentes disponibles en este momento'}
            </p>
            {(searchTerm || selectedCategory !== 'todas') && (
              <div className="space-x-2">
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                >
                  Limpiar búsqueda
                </button>
                <button
                  onClick={() => setSelectedCategory('todas')}
                  className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  Todas las categorías
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">💬</span>
          <h3 className="text-lg font-semibold text-orange-600">
            ¿No encontraste lo que buscabas?
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Si tienes alguna pregunta que no está en nuestra lista de preguntas frecuentes, 
          no dudes en contactarnos usando nuestro chatbot.
        </p>
        <div className="flex items-center text-sm text-orange-600">
          <span className="mr-2">🤖</span>
          El chatbot está disponible en la esquina inferior derecha
        </div>
      </div>

      {/* ChatBot flotante */}
      <ChatBot />
    </div>
  )
}
