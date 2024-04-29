import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchMultiSearch, SEARCH_URL } from '@/services/movies';

import useDebounce from './debounce';

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

  return {
    query,
    handleQueryChange,
    selected,
    handleSelect,
    autocompleteResults,
  };
};

export default useAutocomplete;
