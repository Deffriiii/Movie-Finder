import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTvSeriesTrailers } from '../api/tmdbApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const WatchNowTVSeries = () => {
    const { tvId } = useParams();
    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);
  
    useEffect(() => {
      const fetchTrailers = async () => {
        try {
          const response = await getTvSeriesTrailers(tvId);
          
          // Debugging: log semua video
          console.log('Semua video:', response.results);
  
          // Tambahkan debug info
          setDebugInfo({
            totalVideos: response.results.length,
            youTubeVideos: response.results.filter(v => v.site === 'YouTube').length,
            trailers: response.results.filter(v => v.type === 'Trailer').length,
            teasers: response.results.filter(v => v.type === 'Teaser').length
          });
  
          // Filter YouTube trailers dan teasers
          const tvTrailers = response.results.filter(
            (video) => video.site === 'YouTube' && 
            (video.type === 'Trailer' || video.type === 'Teaser')
          );
          
          setTrailers(tvTrailers);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching TV series trailers:', error);
          setLoading(false);
        }
      };
  
      fetchTrailers();
    }, [tvId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
          animate={{
            rotate: 360,
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
      </motion.div>
    );
  }

  if (trailers.length === 0) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen bg-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-2xl font-bold mb-4"
          >
            Maaf, trailer tidak tersedia untuk serial TV ini.
          </motion.p>
          {debugInfo && (
            <div className="bg-gray-800 p-4 rounded-lg text-left max-w-md mx-auto">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <pre className="text-sm">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 10,
          }}
          className="text-3xl font-bold mb-12 text-center text-blue-400 mt-10"
        >
          Tonton Trailer Serial TV
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {trailers.map((trailer) => (
            <motion.div
              key={trailer.key}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              }}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg cursor-pointer relative group"
              onClick={() => setSelectedTrailer(trailer)}
            >
              <div className="relative pt-[56.25%] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg)`,
                    filter: 'brightness(0.7)',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="bg-white/20 p-4 rounded-full backdrop-blur-sm"
                  >
                    <Play className="text-white w-12 h-12" />
                  </motion.div>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-blue-300">{trailer.name}</h2>
                <Link
                  to={`/tv/${tvId}`}  // Note the leading slash
                  className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                  Lihat Detail Serial TV
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedTrailer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
              onClick={() => setSelectedTrailer(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedTrailer(null)}
                  className="absolute -top-10 right-0 text-white hover:text-red-500 z-60"
                >
                  <X className="w-8 h-8" />
                </button>
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1`}
                  title={selectedTrailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WatchNowTVSeries;