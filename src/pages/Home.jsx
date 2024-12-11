import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, PlayIcon, ChevronRightIcon } from 'lucide-react';
import { fetchMovies } from '../api/tmdbApi';

// Komponen MovieCard (sama seperti sebelumnya)
const MovieCard = ({ movie }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title}
          className="w-full h-[400px] object-cover"
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
          <span className="text-sm">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Komponen MovieSection dengan pagination
const MovieSection = ({ title, endpoint }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const response = await fetchMovies(`${endpoint}?page=${page}`);
        
        // Jika halaman pertama, set ulang daftar film
        if (page === 1) {
          setMovies(response.results.slice(0, 6));
        } else {
          // Tambahkan film baru ke daftar yang sudah ada
          setMovies(prev => [...prev, ...response.results.slice(0, 6)]);
        }

        // Cek apakah masih ada film lagi
        setHasMore(response.results.length > 0 && response.page < response.total_pages);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [endpoint, page, title]);

  // Fungsi untuk memuat lebih banyak film
  const loadMoreMovies = () => {
    setPage(prev => prev + 1);
  };

  // State loading untuk placeholder
  if (loading && page === 1) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-800 animate-pulse h-[450px] rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Tombol Muat Lebih Banyak */}
      {hasMore && (
  <div className="flex justify-center mt-8">
    <Link
  to={
    title === 'Film Trending'
      ? '/trending-movies'
      : '/top-rated-movies'
  }
  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
>
  View More
  <ChevronRightIcon className="ml-2" />
</Link>

  </div>
)}
    </div>
  );
};

// Halaman Utama (Home)
const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black min-h-screen text-white"
    >
      <div className="container mx-auto px-4 py-8 space-y-12">
        <MovieSection 
          title="Film Trending" 
          endpoint="trending/movie/week" 
        />
        
        <MovieSection 
          title="Film Peringkat Teratas" 
          endpoint="movie/top_rated" 
        />
      </div>
    </motion.div>
  );
};

export default Home;