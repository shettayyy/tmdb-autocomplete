import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { MovieResponse } from '@/app-types/movie';
import http from '@/utils/http';

import useDebounce from './debounce';

const SEARCH_URL = '/search/multi';
const DISCOVER_URL = 'discover/movie';

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

// Fetch discover movies
const fetchDiscoverMovies = async () => {
  return await http.get<MovieResponse>(DISCOVER_URL);
};

const useAutocomplete = () => {
  const [query, setQuery] = useState<string>('');
  const [selected, setSelected] = useState<string>('');
  const debouncedQuery = useDebounce<string>(query, 500);

  // Fetch multi search results for autocomplete
  const { data } = useQuery({
    queryKey: [SEARCH_URL, debouncedQuery],
    queryFn: fetchMultiSearch,
    enabled: debouncedQuery.trim() !== '' && !selected,
    refetchOnWindowFocus: false,
  });

  // Fetch discover movies when no query is present
  const { data: discoverData, isLoading: isDiscoverLoading } = useQuery({
    queryKey: [DISCOVER_URL],
    queryFn: fetchDiscoverMovies,
    enabled: !query && !selected,
    refetchOnWindowFocus: false,
  });

  // Fetch the result from the selected item
  const { data: selectedData, isLoading: isSelectedLoading } = useQuery({
    queryKey: [SEARCH_URL, selected],
    queryFn: fetchMultiSearch,
    enabled: !!selected,
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
  const autocompleteResults = data?.data?.results?.slice(0, 5) ?? [];
  const results =
    selectedData?.data?.results ?? discoverData?.data?.results ?? [];
  const isDataEmpty =
    !isDiscoverLoading && !isSelectedLoading && !results.length;

  return {
    query,
    handleQueryChange,
    selected,
    handleSelect,
    autocompleteResults,
    results,
    isEmpty: isDataEmpty,
    isLoading: isDiscoverLoading || isSelectedLoading,
  };
};

export default useAutocomplete;
