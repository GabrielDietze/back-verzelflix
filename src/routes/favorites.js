const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/FavoritesController');
const SharedFavoritesController = require('../controllers/SharedFavoritesController');

// Buscar a lista de favoritos de um usuário
router.get('/api/favorites/:userId', favoritesController.index);

// Adicionar uma mídia (filme ou série) à lista de favoritos
router.post('/api/favorites', favoritesController.store);

// Remover uma mídia da lista de favoritos
router.delete('/api/favorites', favoritesController.delete);

// Gerar um link compartilhável para a lista de favoritos
router.post('/api/favorites/shared/:userId', SharedFavoritesController.createShareLink);

// Acessar a lista de favoritos via link compartilhado
router.get('/api/favorites/shared/:token', SharedFavoritesController.getFavoritesByShareLink);

module.exports = router;
