// Importa o módulo bcryptjs para criptografia de senhas
const bcrypt = require('bcryptjs');
// Importa o modelo User para manipulação de dados de usuários
const User = require('../models/user');
// Importa o módulo jsonwebtoken para criação e verificação de tokens JWT
const jwt = require('jsonwebtoken');
// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Obtém o segredo para criar tokens JWT a partir das variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;

// Função para fazer login do usuário
exports.login = async (req, res) => {
  // Desestrutura as propriedades username e password do corpo da requisição
  const { username, password } = req.body;

  try {
    // Encontra um usuário pelo nome de usuário fornecido
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // Compara a senha fornecida com a senha armazenada no banco de dados
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha inválida' });
    }

    // Cria o payload para o token JWT com as informações do usuário
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      }
    };
    // Gera um token JWT com o payload e o segredo
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token e o ID do usuário na resposta
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para registrar um novo usuário
exports.register = async (req, res) => {
  // Desestrutura as propriedades username, email e password do corpo da requisição
  const { username, email, password } = req.body;

  try {
    // Verifica se o e-mail já está em uso
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'E-mail já está em uso' });
    }

    // Verifica se o nome de usuário já está em uso
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Nome de usuário já está em uso' });
    }

    // Cria uma nova instância de usuário
    user = new User({ username, email, password });

    // Gera um salt e hasheia a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Salva o usuário no banco de dados
    await user.save();

    res.status(201).json({ msg: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para buscar um usuário pelo nome de usuário
exports.getUserByUsername = async (req, res) => {
  // Obtém o nome de usuário dos parâmetros da requisição
  const { username } = req.params;

  try {
    // Encontra o usuário pelo nome de usuário fornecido
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Função para atualizar um usuário pelo nome de usuário
exports.updateUserByUsername = async (req, res) => {
  // Obtém o nome de usuário dos parâmetros e as novas informações do corpo da requisição
  const { username } = req.params;
  const { newUsername, email, password } = req.body;

  try {
      // Encontra o usuário pelo nome de usuário atual
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verifica se o novo nome de usuário já está em uso e atualiza se necessário
      if (newUsername && newUsername !== username) {
          const existingUser = await User.findOne({ username: newUsername });
          if (existingUser) {
              return res.status(400).json({ message: 'Nome de usuário já em uso' });
          }
          user.username = newUsername;
      }

      // Verifica se o e-mail já está em uso e atualiza se necessário
      if (email && email !== user.email) {
          const existingEmailUser = await User.findOne({ email });
          if (existingEmailUser) {
              return res.status(400).json({ message: 'E-mail já em uso' });
          }
          user.email = email;
      }

      // Atualiza a senha se fornecida
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
      }

      // Salva as alterações no banco de dados
      await user.save();

      res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar o usuário' });
  }
};

// Função para apagar um usuário pelo e-mail
exports.deleteUserByEmail = async (req, res) => {
  // Obtém o e-mail dos parâmetros da requisição
  const { email } = req.params;

  try {
    // Encontra e remove o usuário pelo e-mail
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.json({ msg: 'Usuário removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};
