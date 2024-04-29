import { useQuery } from '@tanstack/react-query';

import {
  DISCOVER_URL,
  fetchDiscoverMovies,
  fetchMultiSearch,
  SEARCH_URL,
} from '@/services/movies';

import useAutocomplete from './autocomplete';

export const useMovies = () => {
  const { query, selected } = useAutocomplete();

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

  const results =
    selectedData?.data?.results ?? discoverData?.data?.results ?? [];
  const isDataEmpty =
    !isDiscoverLoading && !isSelectedLoading && !results.length;

  return {
    results,
    isEmpty: isDataEmpty,
    isLoading: isDiscoverLoading || isSelectedLoading,
  };
};
