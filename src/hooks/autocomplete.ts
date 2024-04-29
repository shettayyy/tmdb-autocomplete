import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { MovieResponse } from '@/app-types/movie';
import http from '@/utils/http';

import useDebounce from './debounce';

const SEARCH_URL = '/search/multi';

// Fetch multi search results
const fetchMultiSearch = async ({
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

const useAutocomplete = () => {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce<string>(query, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: [SEARCH_URL, debouncedQuery],
    queryFn: fetchMultiSearch,
    enabled: debouncedQuery.trim() !== '',
    refetchOnWindowFocus: false,
  });

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Final result
  const result = data?.data?.results?.slice(0, 5) ?? [];
  const isDataEmpty = !isLoading && !result.length;

  return {
    query,
    result,
    isLoading,
    isError,
    isEmpty: isDataEmpty,
    handleQueryChange,
  };
};

export default useAutocomplete;
