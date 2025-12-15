import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import ArticleEditor from './pages/ArticleEditor';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthService } from './services/authService';
import { AuthState } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  
  const [init, setInit] = useState(false);

  useEffect(() => {
    const storedAuth = AuthService.getAuthState();
    setAuth(storedAuth);
    setInit(true);
  }, []);

  if (!init) return null;

  const isAdmin = auth.isAuthenticated && auth.user?.role === 'ADMIN';

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar auth={auth} setAuth={setAuth} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail auth={auth} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={!auth.isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/admin/dashboard" />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={isAdmin ? <AdminDashboard auth={auth} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/new" 
              element={isAdmin ? <ArticleEditor auth={auth} /> : <Navigate to="/login" />} 
            />
             <Route 
              path="/admin/edit/:id" 
              element={isAdmin ? <ArticleEditor auth={auth} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Ahmet Ercan Unal. Tüm hakları saklıdır.
                </p>
            </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;