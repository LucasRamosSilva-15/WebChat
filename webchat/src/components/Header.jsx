import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-10 backdrop-blur-lg bg-white/40 rounded-2xl p-4 shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        WebChat
      </Link>
      <nav className="space-x-6">
        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-400 transition'
          }
        >
          Rooms
        </NavLink>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-400 transition'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-400 transition'
          }
        >
          Sobre
        </NavLink>
      </nav>
    </header>
  )
}
