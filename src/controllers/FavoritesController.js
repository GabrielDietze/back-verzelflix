const User = require('../models/user'); // Importa o modelo de usuário do banco de dados

// Buscar a lista de favoritos de um usuário
exports.index = async (req, res) => {
  const { userId } = req.params; // Obtém o userId dos parâmetros da requisição

  try {
    const user = await User.findById(userId); // Procura o usuário pelo ID no banco de dados

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' }); // Retorna erro se o usuário não for encontrado
    }

    res.json({ favoriteMovies: user.favoriteMovies }); // Retorna a lista de filmes favoritos do usuário
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos' }); // Retorna erro genérico em caso de falha na busca
  }
};

// Adicionar uma mídia (filme ou série) à lista de favoritos
exports.store = async (req, res) => {
  const { userId, mediaId, mediaType } = req.body; // Obtém userId, mediaId e mediaType do corpo da requisição

  try {
    const user = await User.findById(userId); // Procura o usuário pelo ID no banco de dados

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' }); // Retorna erro se o usuário não for encontrado
    }

    // Verifica se o filme ou série já está na lista de favoritos
    if (user.favoriteMovies.some(fav => fav.mediaId === mediaId && fav.mediaType === mediaType)) {
      return res.status(400).json({ error: 'Mídia já está na lista de favoritos' }); // Retorna erro se já estiver na lista
    }

    user.favoriteMovies.push({ mediaId, mediaType }); // Adiciona o filme ou série à lista de favoritos
    await user.save(); // Salva a atualização no banco de dados

    res.status(200).json({ message: 'Mídia adicionada aos favoritos' }); // Retorna sucesso ao adicionar
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar mídia aos favoritos' }); // Retorna erro genérico em caso de falha
  }
};

// Remover uma mídia da lista de favoritos
exports.delete = async (req, res) => {
  const { userId, mediaId, mediaType } = req.body; // Obtém userId, mediaId e mediaType do corpo da requisição

  try {
    const user = await User.findById(userId); // Procura o usuário pelo ID no banco de dados

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' }); // Retorna erro se o usuário não for encontrado
    }

    // Encontra o índice do filme ou série na lista de favoritos
    const index = user.favoriteMovies.findIndex(fav => fav.mediaId === mediaId && fav.mediaType === mediaType);
    if (index === -1) {
      return res.status(400).json({ error: 'Mídia não está na lista de favoritos' }); // Retorna erro se não estiver na lista
    }

    user.favoriteMovies.splice(index, 1); // Remove o filme ou série da lista de favoritos
    await user.save(); // Salva a atualização no banco de dados

    res.status(200).json({ message: 'Mídia removida dos favoritos' }); // Retorna sucesso ao remover
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover mídia dos favoritos' }); // Retorna erro genérico em caso de falha
  }
};
