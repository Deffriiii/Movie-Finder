import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Film, Tv, Home, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMulti } from '../api/tmdbApi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const searchData = await searchMulti(query);
      setSearchResults(searchData.results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const navigateToDetails = (item) => {
    const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
    navigate(path);
    resetSearch();
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const getItemImage = (item) => {
    const posterPath = item.poster_path || item.backdrop_path;
    return posterPath 
      ? `https://image.tmdb.org/t/p/w200${posterPath}` 
      : '/placeholder-image.png';
  };

  const NavLinks = () => (
    <div className={`
      ${isMobile 
        ? 'flex flex-col space-y-6 text-center bg-gray-900 p-6 rounded-lg shadow-lg' 
        : 'flex space-x-6 items-center'}
    `}>
      {[ 
        { to: '/', icon: Home, label: 'Home' },
        { to: '/movies', icon: Film, label: 'Movies' },
        { to: '/tv', icon: Tv, label: 'TV Shows' }
      ].map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `
            flex items-center gap-2 
            hover:text-red-400 transition-colors 
            ${isActive 
              ? 'text-red-500 font-bold' 
              : 'text-white/80 hover:text-white'}
            ${isMobile ? 'justify-center py-3 text-lg' : 'text-sm'}
          `}
          onClick={() => {
            setIsMobileMenuOpen(false);
          }}
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
   </div>
  );

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled 
          ? 'bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-black/70 to-transparent'}
      `}
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-3xl font-bold text-white drop-shadow-lg hover:text-red-400 transition-colors"
          >
            MovieFinder
          </Link>

          <div className="flex items-center space-x-6">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-red-400 transition-colors"
            >
              <Search size={24} />
            </button>

            {!isMobile ? (
              <NavLinks />
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white focus:outline-none"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Search Modal (Desktop & Mobile) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xl relative">
                <button
                  onClick={resetSearch}
                  className="absolute -top-10 right-0 text-white hover:text-red-400"
                >
                  <X size={24} />
                </button>

                <input
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    performSearch(e.target.value);
                  }}
                  className="
                    w-full px-6 py-4 
                    bg-gray-800/60 backdrop-blur-sm 
                    text-white text-lg 
                    rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-red-500
                  "
                />

                {searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-gray-800/80 backdrop-blur-sm rounded-lg max-h-96 overflow-y-auto"
                  >
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigateToDetails(item)}
                        className="
                          flex items-center p-4 cursor-pointer 
                          hover:bg-gray-700 transition-colors
                          border-b border-gray-700 last:border-b-0
                        "
                      >
                        <img 
                          src={getItemImage(item)} 
                          alt={item.title || item.name}
                          className="w-16 h-24 object-cover rounded-md mr-4 shadow-md"
                        />
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {item.title || item.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                            {item.release_date && ` • ${item.release_date.split('-')[0]}`}
                            {item.first_air_date && ` • ${item.first_air_date.split('-')[0]}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-0 bg-gradient-to-b from-black/95 to-gray-900 z-50 p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <Link
                  to="/"
                  className="text-2xl font-bold text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  MovieFinder
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;