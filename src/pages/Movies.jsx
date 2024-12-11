import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovies } from '../api/tmdbApi';
import { StarIcon, PlayIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Komponen MovieCard dengan desain yang sama seperti sebelumnya
const MovieCard = ({ movie }) => (
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
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      >
        <div className="flex space-x-4">
          <Link
            to={`/movie/${movie.id}/watch`}
            className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
          >
            <PlayIcon size={24} />
          </Link>
        </div>
      </motion.div>
    </div>

    <div className="p-4 bg-gray-800 bg-opacity-90">
      <h3 className="text-lg font-bold text-white mb-2 truncate">
        {movie.title}
      </h3>
      <div className="flex justify-between items-center text-gray-300">
        <div className="flex items-center space-x-2">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-semibold">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
          {new Date(movie.release_date).getFullYear()}
        </span>
      </div>
    </div>
  </motion.div>
);

// Komponen Slider Horizontal untuk Genre
const HorizontalSlider = ({ movies, genre }) => {
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

  // Fungsi untuk memeriksa scroll
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
        {/* Tombol scroll kiri */}
        {canScrollLeft && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
          >
            <ChevronLeftIcon className="text-white" />
          </motion.button>
        )}

        {/* Slider film */}
        <motion.div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-4 px-2"
          style={{ 
            scrollSnapType: 'x mandatory', 
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="scroll-snap-align-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>

        {/* Tombol scroll kanan */}
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

const Movies = () => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);

  // Efek untuk mengambil daftar genre
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetchMovies('genre/movie/list');
        setGenres(response.genres);
      } catch (error) {
        console.error('Kesalahan mengambil genre:', error);
      }
    };

    fetchGenres();
  }, []);

  // Efek untuk mengambil film berdasarkan genre
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const genrePromises = genres.map((genre) =>
          fetchMovies('discover/movie', { with_genres: genre.id, page: 1 })
        );

        const results = await Promise.all(genrePromises);
        const moviesMap = genres.reduce((acc, genre, index) => {
          acc[genre.name] = results[index].results.slice(0, 10); // Ambil 10 film per genre
          return acc;
        }, {});
        setMoviesByGenre(moviesMap);
        setLoading(false);
      } catch (error) {
        console.error('Kesalahan mengambil film berdasarkan genre:', error);
      }
    };

    if (genres.length > 0) {
      fetchMoviesByGenre();
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
        <h1 className="text-4xl font-extrabold mb-8 mt-12">Film</h1>

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
                movies={moviesByGenre[genre.name] || []}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Movies;