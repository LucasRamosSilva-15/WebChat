import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import LayoutDemo1 from './pages/LayoutDemo1';
import LayoutDemo2 from './pages/LayoutDemo2';

// Layout wrapper that conditionally shows Navbar/Footer
function AppLayout() {
  const location = useLocation();
  const isFullscreenRoute = ['/layout-demo-1', '/layout-demo-2'].includes(location.pathname);

  if (isFullscreenRoute) {
    return (
      <Routes>
        <Route path="/layout-demo-1" element={<LayoutDemo1 />} />
        <Route path="/layout-demo-2" element={<LayoutDemo2 />} />
      </Routes>
    );
  }

  return (
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
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
