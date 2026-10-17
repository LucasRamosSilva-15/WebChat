import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Rooms from './pages/Rooms';
import Chat from './pages/Chat';
import About from './pages/About';
import Custom from './pages/Custom';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import SkyBackground from './components/SkyBackground';

// Páginas que ainda vamos implementar

import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import Suporte from './pages/Suporte';
import Settings from './pages/Settings';
import ButtonsTest from './pages/ButtonsTest';
import Favorites from './pages/Favorites';
import Directs from './pages/Directs';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToastContainer from './components/NotificationToastContainer';


import { useEffect } from 'react';
import { supabase, syncOAuthUserSession } from './services/supabase';

function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        const hasToken = localStorage.getItem('chat_token');
        if (!hasToken) {
          try {
            await syncOAuthUserSession(session);
          } catch (err) {
            console.error('Falha ao sincronizar OAuth com o backend:', err);
          }
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
          <SkyBackground />
          <Navbar />
          <NotificationToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/directs" element={<PrivateRoute><Directs /></PrivateRoute>} />
          <Route path="/direct" element={<PrivateRoute><Directs /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/custom" element={<PrivateRoute><Custom /></PrivateRoute>} />
          <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/suporte" element={<PrivateRoute><Suporte /></PrivateRoute>} />
          <Route path="/buttons" element={<ButtonsTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
        <Footer />
      </div>
    </Router>
  </NotificationProvider>
  );
}

export default App;
