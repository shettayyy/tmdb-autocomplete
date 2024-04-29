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
  const [selected, setSelected] = useState<string>('');
  const debouncedQuery = useDebounce<string>(query, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: [SEARCH_URL, debouncedQuery],
    queryFn: fetchMultiSearch,
    enabled: debouncedQuery.trim() !== '' && !selected,
    refetchOnWindowFocus: false,
  });

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(prevSelected => {
      if (prevSelected && event.target.value !== '') {
        setSelected('');
      }

      return prevSelected;
    });

    setQuery(event.target.value);
  };

  const handleSelect = (selectedItem: string) => {
    setQuery(selectedItem);
    setSelected(selectedItem);
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
    selected,
    handleSelect,
    handleQueryChange,
  };
};

export default useAutocomplete;
