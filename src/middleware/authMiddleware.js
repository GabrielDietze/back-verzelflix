// Importa o módulo jsonwebtoken para criação e verificação de tokens JWT
const jwt = require('jsonwebtoken');
// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();
// Obtém o segredo para verificar tokens JWT a partir das variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  // Obtém o token do cabeçalho Authorization, removendo o prefixo 'Bearer '
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Se nenhum token for fornecido, retorna uma resposta de autorização negada
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada' });
  }

  try {
    // Verifica o token usando o segredo JWT e decodifica suas informações
    const decoded = jwt.verify(token, JWT_SECRET);
    // Adiciona as informações do usuário decodificadas à requisição
    req.user = decoded.user;
    // Chama o próximo middleware ou rota
    next();
  } catch (err) {
    // Se o token for inválido, retorna uma resposta de token inválido
    res.status(401).json({ msg: 'Token inválido' });
  }
};

// Exporta o middleware para ser usado em outras partes do aplicativo
module.exports = authMiddleware;
