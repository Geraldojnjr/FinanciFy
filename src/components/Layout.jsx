
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  PieChart, 
  Home, 
  Wallet, 
  Target, 
  Menu, 
  X,
  User,
  LogOut
} from 'lucide-react';
import logo from '../assets/logo.svg';

const Layout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Contas', path: '/accounts', icon: <Wallet className="w-5 h-5" /> },
    { name: 'Transações', path: '/transactions', icon: <PieChart className="w-5 h-5" /> },
    { name: 'Cartões', path: '/credit-cards', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Metas', path: '/goals', icon: <Target className="w-5 h-5" /> },
    { name: 'Perfil', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <img src={logo} alt="Financify Logo" className="h-8 w-auto" />
            <h1 className="ml-2 text-xl font-bold text-gray-800">Financify</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <div className={`${
                    location.pathname === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button className="flex items-center text-gray-600 hover:text-gray-900 group w-full">
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <img src={logo} alt="Financify Logo" className="h-8 w-auto" />
            <h1 className="ml-2 text-xl font-bold text-gray-800">Financify</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? 
              <X className="h-6 w-6" /> : 
              <Menu className="h-6 w-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-0 z-40 bg-white">
          <div className="flex justify-between items-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={logo} alt="Financify Logo" className="h-8 w-auto" />
              <h1 className="ml-2 text-xl font-bold text-gray-800">Financify</h1>
            </div>
            <button
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="px-4 pt-4 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-base font-medium rounded-md`}
              >
                <div className={`${
                  location.pathname === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 group w-full px-3 py-2 text-base font-medium rounded-md">
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 md:ml-64 bg-gray-100">
        <div className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
