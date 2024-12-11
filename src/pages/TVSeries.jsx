import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovies } from '../api/tmdbApi';
import { StarIcon, PlayIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Komponen TVCard serupa dengan MovieCard
const TVCard = ({ series }) => (
  <motion.div
    whileHover={{ 
      scale: 1.05, 
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" 
    }}
    whileTap={{ scale: 0.95 }}
    className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 min-w-[250px] w-[250px]"
  >
    <div className="relative overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
        alt={series.name}
        className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      >
        <div className="flex space-x-4">
        <Link
          to={`/tv/${series.id}/videos`}
          className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
        >
          <PlayIcon size={24} />
        </Link>

        </div>
      </motion.div>
    </div>

    <div className="p-4 bg-gray-800 bg-opacity-90">
      <h3 className="text-lg font-bold text-white mb-2 truncate">
        {series.name}
      </h3>
      <div className="flex justify-between items-center text-gray-300">
        <div className="flex items-center space-x-2">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-semibold">
            {series.vote_average.toFixed(1)}
          </span>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
          {new Date(series.first_air_date).getFullYear()}
        </span>
      </div>
    </div>
  </motion.div>
);

// Komponen Slider Horizontal untuk Genre TV Series
const HorizontalSlider = ({ series, genre }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    slider?.addEventListener('scroll', checkScroll);
    return () => slider?.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className="relative group">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
        {genre}
      </h2>
      
      <div className="relative">
        {canScrollLeft && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
          >
            <ChevronLeftIcon className="text-white" />
          </motion.button>
        )}

        <motion.div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-4 px-2"
          style={{ 
            scrollSnapType: 'x mandatory', 
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {series.map((item) => (
            <motion.div
              key={item.id}
              className="scroll-snap-align-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TVCard series={item} />
            </motion.div>
          ))}
        </motion.div>

        {canScrollRight && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
          >
            <ChevronRightIcon className="text-white" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

const TVSeries = () => {
  const [genres, setGenres] = useState([]);
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [loading, setLoading] = useState(true);

  // Efek untuk mengambil daftar genre TV Series
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetchMovies('genre/tv/list');
        setGenres(response.genres);
      } catch (error) {
        console.error('Kesalahan mengambil genre TV Series:', error);
      }
    };

    fetchGenres();
  }, []);

  // Efek untuk mengambil TV Series berdasarkan genre
  useEffect(() => {
    const fetchSeriesByGenre = async () => {
      try {
        const genrePromises = genres.map((genre) =>
          fetchMovies('discover/tv', { with_genres: genre.id, page: 1 })
        );

        const results = await Promise.all(genrePromises);
        const seriesMap = genres.reduce((acc, genre, index) => {
          acc[genre.name] = results[index].results.slice(0, 10); // Ambil 10 series per genre
          return acc;
        }, {});
        setSeriesByGenre(seriesMap);
        setLoading(false);
      } catch (error) {
        console.error('Kesalahan mengambil TV Series berdasarkan genre:', error);
      }
    };

    if (genres.length > 0) {
      fetchSeriesByGenre();
    }
  }, [genres]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 mt-12">Serial Tv</h1>

        {/* Tampilan loading */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-700 animate-pulse h-[450px] rounded-2xl"
              ></motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {genres.map((genre) => (
              <HorizontalSlider 
                key={genre.id}
                genre={genre.name}
                series={seriesByGenre[genre.name] || []}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TVSeries;