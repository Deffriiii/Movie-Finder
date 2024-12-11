import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { fetchMovies } from '../api/tmdbApi';
import { Link } from 'react-router-dom';
import { PlayIcon, StarIcon } from 'lucide-react';

const HeroSlide = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetchMovies('trending/movie/week');
        setTrendingMovies(response.results.slice(0, 5)); // Ambil 5 film teratas
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {trendingMovies.map((movie) => (
          <SwiperSlide key={movie.id} className="relative">
            {/* Latar Belakang Penuh Layar */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />

            {/* Overlay Gradient Gelap */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

            {/* Konten Slide */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 md:px-10 lg:px-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Poster Film (Tersembunyi di Mobile) */}
                <div className="hidden md:block">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    className="rounded-lg shadow-2xl transform transition-transform hover:scale-105 opacity-90"
                  />
                </div>

                {/* Informasi Film */}
                <div className="text-white text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                    {movie.title}
                  </h1>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <StarIcon className="text-yellow-400" />
                      <span className="text-sm">{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-300">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>

                  <p className="text-sm md:text-base lg:text-lg mb-6 line-clamp-3 text-gray-300">
                    {movie.overview}
                  </p>

                  <div className="flex justify-center md:justify-start space-x-4">
                    <Link 
                      to={`/movie/${movie.id}/watch`} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors shadow-lg"
                    >
                      <PlayIcon className="w-5 h-5" />
                      Tonton Trailer
                    </Link>
                    <Link 
                      to={`/movie/${movie.id}`} 
                      className="border border-white/70 text-white/90 px-6 py-3 rounded-full hover:bg-white/10 transition-colors shadow-lg"
                    >
                      Detail Film
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradasi di Bagian Bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black via-black/80 to-transparent z-20"></div>
    </div>
  );
};

export default HeroSlide;