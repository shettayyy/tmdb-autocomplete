import { MovieResponse } from '@/app-types/movie';
import http from '@/utils/http';

export const DISCOVER_URL = 'discover/movie';

// Fetch discover movies
export const fetchDiscoverMovies = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  return await http.get<MovieResponse>(DISCOVER_URL, {
    params: {
      page: pageParam,
    },
  });
};

export const SEARCH_URL = '/search/multi';

// Fetch multi search results for useInfiniteQuery
export const fetchMultiSearchInfinite = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number;
  queryKey: string[];
}) => {
  return await http.get<MovieResponse>(SEARCH_URL, {
    params: {
      query: queryKey[1],
      include_adult: false,
      page: pageParam,
    },
  });
};
