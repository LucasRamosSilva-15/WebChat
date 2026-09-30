export default function About() {
  return (
    <div>
      <h1 className="w-[400px] mx-auto bg-white p-6 rounded-lg text-4xl font-bold mb-6 text-center text-black">
        Sobre o WebChat
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <p className="text-gray-700 text-lg mb-4">
          O WebChat é uma aplicação de chat simples e moderna em tempo real,
          construída usando HTML, Tailwind CSS, Node.js, Express, React.js e
          JavaScript. Ele permite que os usuários se comuniquem em tempo real
          em diferentes salas de chat.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Este projeto foi criado como um exemplo de como construir uma
          aplicação web interativa usando tecnologias modernas. Ele inclui
          funcionalidades básicas como registro, login, criação de salas de
          chat e envio de mensagens.
        </p>
      </div>
    </div>
  )
}
