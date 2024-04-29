import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchMultiSearchInfinite, SEARCH_URL } from '@/services/movies';

import useDebounce from './debounce';

interface AutocompleteProps {
  query: string;
}

const useAutocomplete = (props: AutocompleteProps) => {
  const { query } = props;
  const debouncedQuery = useDebounce<string>(query, 500);

  // Fetch multi search results for autocomplete
  const { data } = useInfiniteQuery({
    queryKey: [SEARCH_URL, debouncedQuery],
    queryFn: fetchMultiSearchInfinite,
    initialPageParam: 1,
    getNextPageParam: response =>
      response.data.total_pages > response.data.page
        ? response.data.page + 1
        : undefined,
    getPreviousPageParam: response =>
      response.data.page > 1 ? response.data.page - 1 : undefined,
    enabled: debouncedQuery.trim() !== '',
    refetchOnWindowFocus: false,
    meta: {
      toast: true,
    },
  });

  // Final result
  const autocompleteResults =
    data?.pages.flatMap(page => page.data.results)?.slice(0, 5) ?? [];

  return {
    autocompleteResults,
  };
};

export default useAutocomplete;
