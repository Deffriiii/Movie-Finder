import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTvSeriesDetails } from '../api/tmdbApi';
import { StarIcon, Clock, Globe, Tags, Info, PlayIcon, Video } from 'lucide-react';

const TvSeriesDetail = () => {
  const { tvId } = useParams();
  const [tvSeries, setTvSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchTvSeriesDetails = async () => {
      try {
        const data = await getTvSeriesDetails(tvId);
        setTvSeries(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV series details:', error);
        setLoading(false);
      }
    };
    fetchTvSeriesDetails();
  }, [tvId]);

  // Animasi loading dengan spinner yang berputar
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen bg-black"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full"
        />
      </motion.div>
    );
  }

  // Tampilan jika TV series tidak ditemukan
  if (!tvSeries) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen bg-black text-white"
      >
        <p>TV Series tidak ditemukan.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black min-h-screen text-white"
    >
      {/* Bagian Latar Belakang dengan Animasi */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full h-[70vh] md:h-[80vh] relative bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${tvSeries.backdrop_path})`,
        }}
      >
        {/* Overlay gelap untuk meningkatkan keterbacaan teks */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Informasi TV Series di Bagian Bawah */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-0 left-0 p-4 md:p-8 text-white"
        >
          <h1 className="text-3xl md:text-5xl font-bold">{tvSeries.name}</h1>
          <div className="flex flex-wrap items-center mt-4 space-x-4">
            <div className="flex items-center">
              <StarIcon className="text-yellow-400 mr-2" />
              <span>{tvSeries.vote_average.toFixed(1)} / 10</span>
            </div>
            <div>
              {new Date(tvSeries.first_air_date).toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Konten Detail dengan Grid Responsif */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Poster TV Series dengan Animasi */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex justify-center"
          >
            <img 
              src={`https://image.tmdb.org/t/p/w500${tvSeries.poster_path}`} 
              alt={tvSeries.name} 
              className="rounded-lg shadow-lg w-full md:w-3/4 max-h-[500px] object-cover"
            />
          </motion.div>

          {/* Informasi TV Series dengan Animasi Bertahap */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="md:col-span-2"
          >
            {/* Sinopsis */}
            <motion.h2 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-2xl md:text-3xl font-semibold mb-4 flex items-center"
            >
              <Info className="mr-3 text-red-500" /> Sinopsis
            </motion.h2>
            <p className="text-gray-300 mb-6">{tvSeries.overview}</p>

            {/* Detail Informasi dengan Ikon */}
            <motion.h2 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-2xl md:text-3xl font-semibold mb-4 flex items-center"
            >
              <Tags className="mr-3 text-red-500" /> Informasi TV Series
            </motion.h2>
            <motion.ul 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="text-gray-300 space-y-3"
            >
              <li className="flex items-center">
                <Globe className="mr-3 text-red-400" />
                <strong>Judul Asli:</strong> {tvSeries.original_name}
              </li>
              <li className="flex items-center">
                <Globe className="mr-3 text-red-400" />
                <strong>Bahasa Asli:</strong> {tvSeries.original_language.toUpperCase()}
              </li>
              <li className="flex items-center">
                <Clock className="mr-3 text-red-400" />
                <strong>Jumlah Season:</strong> {tvSeries.number_of_seasons} Season
              </li>
              <li className="flex items-center">
                <Tags className="mr-3 text-red-400" />
                <strong>Genre:</strong> {tvSeries.genres.map(genre => genre.name).join(', ')}
              </li>
              <li className="flex items-center">
                <Info className="mr-3 text-red-400" />
                <strong>Status:</strong> {tvSeries.status}
              </li>
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Tombol Tonton Trailer dan Detail Film */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex space-x-4 mt-6 justify-center md:justify-start"
        >
          <Link 
            to={`/tv/${tvId}/videos`} 
            className="relative overflow-hidden group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ 
                x: isHovering ? '0%' : '-100%',
              }}
              transition={{ 
                type: 'tween',
                duration: 0.3
              }}
              className="absolute inset-0 bg-red-500 z-0 opacity-80"
            />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10 bg-transparent border-2 border-red-500 text-red-500 hover:text-white px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 ease-in-out"
            >
              <Video className="w-6 h-6 transition-transform group-hover:rotate-12" />
              <span className="font-semibold text-sm md:text-base">
                Tonton Trailer
              </span>
              <motion.div
                animate={{ 
                  rotate: isHovering ? 360 : 0,
                  scale: isHovering ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
                className="ml-2"
              >
                <PlayIcon className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TvSeriesDetail;