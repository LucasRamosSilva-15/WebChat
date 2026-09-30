import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// Mensagens de exemplo (remover quando o backend estiver pronto)
const initialMessages = [
  { id: 1, author: 'Alice', text: 'Hi everyone!' },
  { id: 2, author: 'Bob', text: 'Hello Alice!' },
]

export default function Chat() {
  const { room } = useParams()
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Scroll automático ao receber nova mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    // TODO: enviar mensagem para o backend/websocket
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), author: 'Você', text: trimmed },
    ])
    setInput('')
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold capitalize">#{room}</h1>
        <Link to="/rooms" className="text-white hover:underline text-sm">
          ← Voltar para Rooms
        </Link>
      </div>

      {/* Área de mensagens */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 h-96 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <span className="font-semibold">{msg.author}: </span>
            <span className="text-gray-700">{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
          placeholder="Type your message..."
          className="flex-grow bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  )
}
