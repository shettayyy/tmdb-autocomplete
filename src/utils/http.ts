import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_TMDB_API_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

export default http;
