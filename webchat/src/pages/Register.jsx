import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: chamar a API de registro aqui
    console.log('Registro com:', form)
    // Após registrar, redirecionar:
    // navigate('/login')
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center bg-gray-100 p-10 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">WebChat</h1>
        <p className="text-gray-600 text-lg mb-8">Please register for a new account.</p>
        <div className="space-y-4">
          <div className="text-left">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Register
          </button>
          <p className="text-gray-600 text-sm">
            Já tem conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
