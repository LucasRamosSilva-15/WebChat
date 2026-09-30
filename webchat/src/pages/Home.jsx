import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center bg-gray-100 p-10 rounded-2xl shadow-lg">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">WebChat</h1>
        <p className="text-gray-600 text-lg mb-8">
          Aplicaçao WebChat
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
