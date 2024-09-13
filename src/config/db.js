const mongoose = require('mongoose'); // Importa a biblioteca Mongoose para interagir com o MongoDB
require('dotenv').config(); // Carrega variáveis de ambiente de um arquivo .env para o process.env

// Função assíncrona para conectar ao banco de dados MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // Obtém a URI do MongoDB da variável de ambiente MONGODB_URI
    await mongoose.connect(uri); // Tenta se conectar ao MongoDB usando a URI
    console.log('MongoDB connected'); // Exibe mensagem de sucesso se a conexão for estabelecida
  } catch (error) {
    console.error('Error connecting to MongoDB:', error); // Exibe uma mensagem de erro se ocorrer algum problema na conexão
    process.exit(1); // Sai do processo com um código de erro (1) em caso de falha
  }
};

module.exports = connectDB; 
