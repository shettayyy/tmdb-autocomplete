import { MovieResponse } from '@/app-types/movie';
import http from '@/utils/http';

export const DISCOVER_URL = 'discover/movie';

// Fetch discover movies
export const fetchDiscoverMovies = async () => {
  return await http.get<MovieResponse>(DISCOVER_URL);
};

export const SEARCH_URL = '/search/multi';

// Fetch multi search results
export const fetchMultiSearch = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  return await http.get<MovieResponse>(SEARCH_URL, {
    params: {
      query: queryKey[1],
      include_adult: false,
    },
  });
};
