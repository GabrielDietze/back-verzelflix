const User = require('../models/user');
const crypto = require('crypto');

// Gera um link compartilhável com prazo de validade
exports.createShareLink = async (req, res) => {
  const { userId } = req.params;

  try {
    // Verifica se o usuário existe
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Gera um token único para o link compartilhável
    const token = crypto.randomBytes(16).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Link expira em 1 hora

    // Armazena o token e a data de expiração no usuário
    user.sharedLinkToken = token;
    user.sharedLinkExpires = expiresAt;
    await user.save();

    // Cria o link de compartilhamento
    const shareLink = `https://verzelflix-crjrnv0g7-dietzes-projects.vercel.app/favorites/shared/${token}`;

    res.status(200).json({ message: 'Link de compartilhamento gerado', shareLink });
  } catch (err) {
    console.error('Erro ao gerar link de compartilhamento:', err);
    res.status(500).json({ error: 'Erro ao gerar link de compartilhamento' });
  }
};

// Acessa a lista de favoritos via link compartilhado
exports.getFavoritesByShareLink = async (req, res) => {
  const { token } = req.params;

  try {
    // Encontra o usuário pelo token de compartilhamento
    const user = await User.findOne({ sharedLinkToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Link inválido ou expirado' });
    }

    // Verifica se o link ainda está dentro do prazo de validade
    const currentTime = new Date();
    if (currentTime > user.sharedLinkExpires) {
      return res.status(400).json({ error: 'Link expirado' });
    }

    // Retorna a lista de filmes favoritos do usuário
    res.status(200).json({ userName: user.username, favoriteMovies: user.favoriteMovies });
  } catch (err) {
    console.error('Erro ao acessar favoritos via link compartilhado:', err);
    res.status(500).json({ error: 'Erro ao acessar favoritos' });
  }
};
