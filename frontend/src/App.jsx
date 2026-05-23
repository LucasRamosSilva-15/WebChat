import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import Chat from './pages/Chat';
import About from './pages/About';
import Custom from './pages/Custom';
import LayoutDemo from './pages/LayoutDemo';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/layout-demo" element={<LayoutDemo />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
