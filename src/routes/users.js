const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UserController');

// Login do usuário
router.post('/api/login', usersController.login);

// Registrar um novo usuário
router.post('/api/register', usersController.register);

// Atualizar um usuário pelo nome de usuário
router.put('/api/user/:username', usersController.updateUserByUsername);

// Buscar um usuário pelo username
router.get('/api/user/:username', usersController.getUserByUsername);

// Apagar um usuário pelo e-mail
router.delete('/api/user/:email', usersController.deleteUserByEmail);

module.exports = router;
