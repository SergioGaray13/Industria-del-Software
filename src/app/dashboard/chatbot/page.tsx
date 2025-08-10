import ChatBot from '@/components/ChatBot'

export default function ChatbotPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Asistente Virtual</h1>
      <p className="text-gray-600 mb-8">Hazle preguntas sobre Eventualy o cómo usar la plataforma.</p>
      <ChatBot />
    </div>
  )
}
