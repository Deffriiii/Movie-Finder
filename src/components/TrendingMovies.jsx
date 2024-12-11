import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchMovies } from '../api/tmdbApi';
import { StarIcon, PlayIcon, ArrowLeftIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// MovieCard Component
const MovieCard = ({ movie }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg"
  >
    <div className="relative">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[400px] object-cover sm:h-[300px] lg:h-[400px]"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/movie/${movie.id}/watch`}
            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
          >
            <PlayIcon />
          </Link>
        </div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white truncate mb-2">
        {movie.title}
      </h3>
      <div className="flex justify-between items-center text-gray-400">
        <div className="flex items-center space-x-1">
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
        <span className="text-sm">{new Date(movie.release_date).getFullYear()}</span>
      </div>
    </div>
  </motion.div>
);

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Navigate for "Back to Home"

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetchMovies('trending/movie/week');
        setMovies(response.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };
    fetchTrendingMovies();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Back Button and Header - Flexbox Layout */}
        <div className="flex justify-between items-center mb-6 mt-12">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            Trending Movies
          </motion.h1>

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 animate-pulse h-[450px] rounded-lg"></div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TrendingMovies;
