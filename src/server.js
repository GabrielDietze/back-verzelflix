const express = require('express');
const app = express();
const cors = require('cors');
const usersRouter = require('./routes/users');
const connectDB = require('./config/db');
const movieRouter = require('./routes/movies');
const favoriteRouter = require('./routes/favorites');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config()


const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());

app.use( usersRouter);
app.use( favoriteRouter, authMiddleware);
app.use( movieRouter, authMiddleware);  




app.listen(port, () => {
  console.log('Server running on port ' + port);
});