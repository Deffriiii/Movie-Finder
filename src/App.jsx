import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TvSeries';
import HeroSlide from './components/HeroSlide';
import MovieDetail from './components/MovieDetail';
import TvSeriesDetail from './components/TvSeriesDetail'; // Pastikan Anda membuat komponen ini
import WatchNow from './components/WatchNow';
import WatchNowTVSeries from './components/WatchNowTvSeries';
import TrendingMovies from './components/TrendingMovies';
import TopRatedMovies from './components/TopRatedMovies';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* HeroSlide di Halaman Home */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSlide />
                <Home />
              </>
            } 
          />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVSeries />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          <Route path="/tv/:tvId" element={<TvSeriesDetail />} /> {/* Tambahkan rute ini */}
          <Route path="/movie/:movieId/watch" element={<WatchNow />} />
          <Route path="/tv/:tvId/videos" element={<WatchNowTVSeries />} />
          <Route path="/trending-movies" element={<TrendingMovies />} />
          <Route path="/top-rated-movies" element={<TopRatedMovies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;