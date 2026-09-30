import { Link } from 'react-router-dom'

const rooms = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'A place for general discussions.',
  },
  {
    id: 'tech',
    name: 'Tech Talk',
    description: 'Discuss the latest in technology.',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Chat about your favorite games.',
  },
]

export default function Rooms() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="w-[200px] text-center mx-auto bg-gray-100 p-3 rounded-2xl shadow-lg text-3xl font-bold mb-6">
        Chat Rooms
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
            <p className="text-gray-600 mb-4">{room.description}</p>
            <Link
              to={`/chat/${room.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Join
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
