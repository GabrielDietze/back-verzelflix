const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/MoviesController');

// Buscar filmes em cartaz
router.get('/api/search/:query', moviesController.searchMoviesAndTVShows);

// Buscar filmes ou séries por categoria
router.get('/api/discover/:mediaType', moviesController.discoverByCategory);

// Buscar detalhes de filme ou série
router.get('/api/:type/:id', moviesController.getDetails);

// Buscar filmes por categoria
router.get('/api/movie/:category', moviesController.getMoviesByCategory);

// Buscar filmes por gênero
router.get('/api/movie/genre/:genreId', moviesController.getMoviesByGenre);

module.exports = router;
