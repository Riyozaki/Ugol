import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { name: 'Главная', path: '/' },
  { name: 'Услуги', path: '/services' },
  { name: 'Мастера', path: '/masters' },
  { name: 'Галерея', path: '/gallery' },
  { name: 'О нас', path: '/about' },
  { name: 'Контакты', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-loft-black/80 border-b border-loft-dark/30 backdrop-blur-xl py-2 shadow-lg' : 'bg-transparent border-b border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`p-2 border-2 border-loft-green transform rotate-45 group-hover:bg-loft-green group-hover:rotate-0 transition-all duration-500 shadow-[0_0_15px_rgba(47,122,94,0.3)]`}>
              <Scissors className="h-5 w-5 text-loft-light transform -rotate-45 group-hover:rotate-0 transition-all duration-500" />
            </div>
            <div className="flex flex-col -space-y-1">
                <span className="font-heading text-2xl tracking-[0.2em] text-loft-light group-hover:text-loft-green-bright transition-colors drop-shadow-md">УГОЛ</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-sub font-bold uppercase tracking-wider transition-all relative ${
                  location.pathname === link.path ? 'text-loft-light' : 'text-loft-gray hover:text-loft-light'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                    <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-loft-green shadow-[0_0_8px_#2F7A5E]" />
                )}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-loft-dark text-loft-light transition-colors relative overflow-hidden group"
              aria-label="Toggle theme"
            >
               <div className="absolute inset-0 bg-loft-green/20 scale-0 group-hover:scale-100 transition-transform rounded-full"></div>
              {theme === 'dark' ? <Sun className="h-5 w-5 relative z-10" /> : <Moon className="h-5 w-5 relative z-10" />}
            </button>

            <Link
              to="/booking"
              className="relative overflow-hidden bg-loft-green text-white px-8 py-2.5 rounded-sm font-heading tracking-widest text-lg transition-all group"
            >
              <span className="relative z-10 group-hover:translate-x-1 transition-transform inline-block">Запись</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </Link>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-loft-dark text-loft-light transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button
              onClick={toggleMenu}
              className="text-loft-light hover:text-loft-green transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-loft-black/95 backdrop-blur-xl border-b border-loft-dark overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 border-l-2 text-base font-sub font-bold uppercase tracking-wide transition-all ${
                    location.pathname === link.path
                      ? 'text-loft-light border-loft-green bg-loft-green/10'
                      : 'text-loft-gray border-transparent hover:text-loft-light hover:bg-loft-dark'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center mt-6 bg-loft-green hover:bg-loft-green-bright text-white px-4 py-4 rounded-sm font-heading text-xl tracking-widest shadow-[0_0_15px_rgba(47,122,94,0.3)]"
              >
                Записаться онлайн
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;