import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Fungsi umum untuk fetch data
export const fetchMovies = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Mendapatkan detail film berdasarkan ID
export const getMovieDetails = (movieId) => 
  fetchMovies(`movie/${movieId}`, { 
    append_to_response: 'videos,credits' 
  });

// Mendapatkan detail TV Series berdasarkan ID
export const getTvSeriesDetails = (tvId) => 
  fetchMovies(`tv/${tvId}`, { 
    append_to_response: 'videos,credits' 
  });

// Mendapatkan film berdasarkan genre
export const getMoviesByGenre = (genreId, options = {}) => {
  const defaultOptions = {
    page: 1,
    language: 'en-US',
    sort_by: 'popularity.desc'
  };

  const discoverParams = { 
    with_genres: genreId,
    ...defaultOptions,
    ...options
  };

  return fetchMovies('discover/movie', discoverParams);
};

// Mendapatkan TV Series berdasarkan genre
export const getTvSeriesByGenre = (genreId, options = {}) => {
  const defaultOptions = {
    page: 1,
    language: 'en-US',
    sort_by: 'popularity.desc'
  };

  const discoverParams = { 
    with_genres: genreId,
    ...defaultOptions,
    ...options
  };

  return fetchMovies('discover/tv', discoverParams);
};

// Mendapatkan trailer/video TV Series berdasarkan ID
export const getTvSeriesTrailers = async (tvId) => {
  if (!tvId) {
    throw new Error('ID TV Series diperlukan');
  }

  try {
    const response = await fetchMovies(`tv/${tvId}/videos`, {
      language: 'en-US'
    });

    // Pastikan mengembalikan objek dengan struktur yang benar
    return {
      results: response.results || [], // Gunakan array kosong jika tidak ada results
      id: tvId
    };
  } catch (error) {
    console.error('Error di getTvSeriesTrailers:', error);
    // Kembalikan objek dengan results kosong
    return {
      results: [],
      id: tvId
    };
  }
};
// Search API
export const searchMulti = async (query, page = 1) => {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  try {
    const response = await fetchMovies('search/multi', {
      query: query,
      page: page,
      include_adult: false,
      language: 'en-US'
    });

    // Filter out people and keep only movies and TV shows
    const filteredResults = response.results.filter(
      item => item.media_type === 'movie' || item.media_type === 'tv'
    );

    return {
      ...response,
      results: filteredResults
    };
  } catch (error) {
    console.error('Search API Error:', error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};