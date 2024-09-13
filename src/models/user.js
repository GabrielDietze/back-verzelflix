const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,    // Remove espaços em branco ao redor do nome de usuário
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Converte o e-mail para minúsculas
    trim: true,      // Remove espaços em branco ao redor do e-mail
  },
  password: {
    type: String,
    required: true,
  },
  favoriteMovies: [
    {
      mediaId: { type: Number, required: true }, 
      mediaType: { type: String, required: true }   // 'movie' ou 'tv'
    }
  ],
  sharedLinkToken: { type: String },
  sharedLinkExpires: { type: Date },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
