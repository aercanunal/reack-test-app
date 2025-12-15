import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthState, UserRole } from '../types';
import { AuthService } from '../services/authService';
import { LogOut, LayoutDashboard, Menu, X, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    AuthService.logout();
    setAuth(AuthService.getAuthState());
    navigate('/login');
  };

  const isAdmin = auth.user?.role === UserRole.ADMIN;

  return (
    <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl tracking-tight text-blue-400">AEU.dev</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">Ana Sayfa</Link>
            <Link to="/about" className="hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">Hakkımda</Link>
            <Link to="/contact" className="hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">İletişim</Link>
            
            {isAdmin && (
              <Link to="/admin/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <LayoutDashboard size={16} />
                Yönetim
              </Link>
            )}

            {auth.isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4 border-l border-gray-700 pl-4">
                <span className="text-sm text-gray-300 hidden lg:block">Merhaba, {auth.user?.displayName}</span>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white" title="Çıkış Yap">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <UserIcon size={16} /> Giriş
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Ana Sayfa</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Hakkımda</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">İletişim</Link>
            
            {isAdmin && (
              <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-gray-700">Yönetim Paneli</Link>
            )}
            
            <div className="border-t border-gray-700 mt-4 pt-4">
              {auth.isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700">
                  Çıkış Yap ({auth.user?.username})
                </button>
              ) : (
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Giriş Yap</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;