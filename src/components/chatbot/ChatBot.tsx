'use client'

import { useState, useEffect, useRef } from 'react'
import { SendHorizonal, Bot } from 'lucide-react'

type Message = { from: 'user' | 'bot'; text: string }

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Hace scroll al final cada vez que cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || loading) return

    const userMessage: Message = { from: 'user', text: message.trim() }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      const botMessage: Message = { from: 'bot', text: data.reply || 'No hay respuesta.' }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      setMessages(prev => [...prev, { from: 'bot', text: 'Ocurrió un error al procesar la solicitud.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        aria-label="Abrir chat"
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <Bot />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
          className="fixed bottom-20 right-6 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50"
        >
          <header className="p-4 border-b border-gray-200 font-semibold" id="chatbot-title">
            ChatBot
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm whitespace-pre-wrap ${
                  m.from === 'user'
                    ? 'bg-orange-100 text-right ml-auto max-w-[80%]'
                    : 'bg-gray-100 text-left mr-auto max-w-[80%]'
                }`}
                aria-live={m.from === 'bot' ? 'polite' : undefined}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="bg-gray-100 p-2 rounded-lg mr-auto max-w-[80%] text-gray-500 text-sm" aria-live="polite">
                Escribiendo...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="p-2 border-t flex items-center gap-2"
          >
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              aria-label="Mensaje"
            />
            <button
              type="submit"
              className="text-orange-500 hover:text-orange-600 disabled:text-orange-300"
              disabled={loading || !message.trim()}
              aria-label="Enviar mensaje"
            >
              <SendHorizonal size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
