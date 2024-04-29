import axios from 'axios';

const http = axios.create({
  baseURL: process.env.TMDB_API_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

export default http;
