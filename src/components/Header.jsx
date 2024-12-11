import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Film, Tv, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovies } from '../api/tmdbApi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Efek untuk menangani scroll dan resize
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Tutup menu mobile saat ukuran layar berubah
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fungsi untuk mencari film/series
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await fetchMovies(`search/multi?query=${query}`);
        setSearchResults(response.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Fungsi untuk menangani klik hasil pencarian
  const handleSearchResultClick = (result) => {
    navigate(`/${result.media_type}/${result.id}`);
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Komponen navigasi yang dapat digunakan di desktop dan mobile
  const NavLinks = () => (
    <div className={`${isMobile ? 'flex flex-col space-y-6 text-center' : 'flex space-x-6'}`}>
      {/* Navigasi dengan efek aktif dan hover yang konsisten */}
      {[
        { to: '/', icon: Home, label: 'Beranda' },
        { to: '/movies', icon: Film, label: 'Film' },
        { to: '/tv', icon: Tv, label: 'Serial TV' }
      ].map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `
            flex items-center gap-2 
            hover:text-red-400 transition-colors 
            ${isActive ? 'text-red-500 font-bold' : 'text-white/90'}
            ${isMobile ? 'justify-center py-2' : ''}
          `}
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
          }}
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </div>
  );

  // Komponen input pencarian
  const SearchInput = ({ mobile = false }) => (
    <div className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        className={`
          w-full bg-gray-800 text-white 
          ${mobile ? 'px-4 py-3 rounded-lg pl-10' : 'px-4 py-2 rounded-lg pl-10'}
          focus:outline-none focus:ring-2 focus:ring-red-500
        `}
        placeholder="Cari film atau serial TV..."
      />
      <Search 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
      
      {/* Hasil Pencarian */}
      <AnimatePresence>
        {searchQuery.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute top-full left-0 right-0 mt-2 
              bg-gray-800 rounded-lg shadow-lg z-50 
              ${mobile ? 'max-h-72' : 'max-h-64'} 
              overflow-y-auto
            `}
          >
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((result) => (
                  <motion.li 
                    key={result.id}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                  >
                    <button
                      onClick={() => handleSearchResultClick(result)}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-700 text-white"
                    >
                      {result.title || result.name}
                    </button>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">Tidak ada hasil yang ditemukan.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 
        ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white drop-shadow-lg hover:text-red-400 transition-colors"
          >
            MovieFinder
          </Link>

          {/* Navigasi Desktop */}
          {!isMobile ? (
            <div className="flex items-center space-x-6">
              <div className="w-80">
                <SearchInput />
              </div>
              <NavLinks />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Tombol Pencarian Mobile */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-white"
              >
                <Search size={24} />
              </button>

              {/* Tombol Menu Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Overlay Pencarian Mobile */}
        <AnimatePresence>
          {isMobile && isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed inset-0 bg-black bg-opacity-95 z-50 p-4"
            >
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-0 top-0 text-white"
                >
                  <X size={24} />
                </button>
                
                <div className="mt-12">
                  <SearchInput mobile={true} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-0 bg-black bg-opacity-95 z-50"
            >
              <nav className="flex flex-col h-full">
                <div className="flex justify-between p-6">
                  <Link
                    to="/"
                    className="text-2xl font-bold text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MovieFinder
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white focus:outline-none"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex-grow flex flex-col justify-center items-center space-y-6">
                  <NavLinks />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;