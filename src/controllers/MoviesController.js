const axios = require('axios'); // Importa a biblioteca axios para fazer requisições HTTP
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const TMDB_API_KEY = process.env.TMDB_API_KEY; // Obtém a chave da API TMDB do arquivo .env
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'; // Define a URL base da API do TMDB
const LANGUAGE_PARAM = 'pt-BR'; // Define o parâmetro de idioma como português brasileiro

// Função para buscar filmes e séries com base em uma query de busca
exports.searchMoviesAndTVShows = async (req, res) => {
  const query = req.query.query; // Obtém a query de busca a partir dos parâmetros da requisição

  if (!query) {
    return res.status(400).json({ error: 'Parâmetro de busca não fornecido' }); // Retorna erro se não houver query
  }

  try {
    // Faz duas requisições simultâneas: uma para filmes e outra para séries
    const [moviesResponse, tvShowsResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY, // Passa a chave da API
          query: query, // Passa a query de busca
          language: LANGUAGE_PARAM // Define o idioma da resposta como português
        }
      }),
      axios.get(`${TMDB_BASE_URL}/search/tv`, {
        params: {
          api_key: TMDB_API_KEY, // Passa a chave da API
          query: query, // Passa a query de busca
          language: LANGUAGE_PARAM // Define o idioma da resposta como português
        }
      })
    ]);

    // Combina os resultados de filmes e séries e os envia como resposta
    res.json({
      movies: moviesResponse.data.results,
      tvShows: tvShowsResponse.data.results
    });
  } catch (error) {
    console.error('Erro ao buscar filmes e séries:', error.message); // Loga o erro no console
    res.status(500).json({ error: 'Erro ao buscar filmes e séries' }); // Retorna erro genérico se a busca falhar
  }
};

// Função para buscar filmes ou séries por categoria (baseado no gênero)
exports.discoverByCategory = async (req, res) => {
  const mediaType = req.params.mediaType; // Obtém o tipo de mídia ('movie' ou 'tv') dos parâmetros
  const genreId = req.query.genreId; // Obtém o ID do gênero da query string

  // Verifica se o tipo de mídia é válido ('movie' ou 'tv')
  if (!['movie', 'tv'].includes(mediaType)) {
    return res.status(400).send('Tipo de mídia inválido'); // Retorna erro se o tipo de mídia for inválido
  }

  try {
    // Faz a requisição para a API do TMDB com base no tipo de mídia e gênero
    const response = await axios.get(`${TMDB_BASE_URL}/discover/${mediaType}`, {
      params: {
        api_key: TMDB_API_KEY, // Passa a chave da API
        language: LANGUAGE_PARAM, // Define o idioma da resposta como português
        with_genres: genreId, // Filtra pelos gêneros fornecidos
        with_networks: 213 // Filtra apenas conteúdos da Netflix (ID 213)
      }
    });
    res.json(response.data); // Envia os dados da resposta como JSON
  } catch (error) {
    console.error(error); // Loga o erro no console
    res.status(500).send('Erro ao buscar dados'); // Retorna erro genérico se a busca falhar
  }
};

// Função para buscar detalhes de um filme ou série pelo ID
exports.getDetails = async (req, res) => {
  const { type, id } = req.params; // Obtém o tipo ('movie' ou 'tv') e o ID dos parâmetros

  // Verifica se o tipo é válido ('movie' ou 'tv')
  if (type !== 'movie' && type !== 'tv') {
    return res.status(400).json({ error: 'Tipo inválido. Use "movie" ou "tv".' }); // Retorna erro se o tipo for inválido
  }

  try {
    // Faz a requisição para buscar os detalhes do filme ou série
    const response = await axios.get(`${TMDB_BASE_URL}/${type}/${id}`, {
      params: {
        api_key: TMDB_API_KEY, // Passa a chave da API
        language: LANGUAGE_PARAM, // Define o idioma da resposta como português
        with_networks: type === 'movie' ? 213 : undefined // Adiciona o filtro with_networks apenas para filmes
      }
    });
    res.json(response.data); // Envia os dados da resposta como JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar detalhes' }); // Retorna erro genérico se a busca falhar
  }
};

// Função para buscar filmes por categoria (ex: 'top_rated', 'action')
exports.getMoviesByCategory = async (req, res) => {
  const category = req.params.category; // Obtém a categoria dos parâmetros
  try {
    // Faz a requisição para buscar filmes pela categoria fornecida
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${category}`, {
      params: {
        api_key: TMDB_API_KEY, // Passa a chave da API
        language: LANGUAGE_PARAM, // Define o idioma da resposta como português
        with_networks: 213 // Filtra apenas conteúdos da Netflix (ID 213)
      }
    });
    res.json(response.data); // Envia os dados da resposta como JSON
  } catch (error) {
    console.error(error); // Loga o erro no console
    res.status(500).send('Erro ao buscar filme por categoria'); // Retorna erro genérico se a busca falhar
  }
};

// Função para buscar filmes por gênero
exports.getMoviesByGenre = async (req, res) => {
  const genreId = req.params.genreId; // Obtém o ID do gênero dos parâmetros
  try {
    // Faz a requisição para buscar filmes pelo gênero fornecido
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY, // Passa a chave da API
        language: LANGUAGE_PARAM, // Define o idioma da resposta como português
        with_genres: genreId, // Filtra filmes pelo gênero
        with_networks: 213 // Filtra apenas conteúdos da Netflix (ID 213)
      }
    });
    res.json(response.data); // Envia os dados da resposta como JSON
  } catch (error) {
    console.error(error); // Loga o erro no console
    res.status(500).send('Erro ao buscar filmes por gênero'); // Retorna erro genérico se a busca falhar
  }
};
