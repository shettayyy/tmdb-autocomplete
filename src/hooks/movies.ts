import { useInfiniteQuery } from '@tanstack/react-query';

import {
  DISCOVER_URL,
  fetchDiscoverMovies,
  fetchMultiSearchInfinite,
  SEARCH_URL,
} from '@/services/movies';

export const useMovies = (query: string, selected: string) => {
  // Fetch discover movies when no query is present
  const {
    data: discoverData,
    isLoading: isDiscoverLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [DISCOVER_URL],
    queryFn: fetchDiscoverMovies,
    initialPageParam: 1,
    getNextPageParam: response =>
      response.data.total_pages > response.data.page
        ? response.data.page + 1
        : undefined,
    getPreviousPageParam: response =>
      response.data.page > 1 ? response.data.page - 1 : undefined,
    enabled: !selected,
    refetchOnWindowFocus: false,
    meta: {
      toast: true,
    },
  });

  // Fetch the result from the selected item
  const {
    data: selectedData,
    isLoading: isSelectedLoading,
    hasNextPage: hasSelectedNextPage,
    fetchNextPage: fetchSelectedNextPage,
  } = useInfiniteQuery({
    queryKey: [SEARCH_URL, selected],
    queryFn: fetchMultiSearchInfinite,
    initialPageParam: 1,
    getNextPageParam: response =>
      response.data.total_pages > response.data.page
        ? response.data.page + 1
        : undefined,
    getPreviousPageParam: response =>
      response.data.page > 1 ? response.data.page - 1 : undefined,
    enabled: !!selected,
    refetchOnWindowFocus: false,
    meta: {
      toast: true,
    },
  });

  const results =
    selected && query
      ? selectedData?.pages.flatMap(page => page.data.results) ?? []
      : discoverData?.pages.flatMap(page => page.data.results) ?? [];

  const isDataEmpty =
    !isDiscoverLoading && !isSelectedLoading && !results?.length;

  const loadNextPage = () => {
    if (selected) {
      if (hasSelectedNextPage) {
        void fetchSelectedNextPage();
      }
    } else {
      if (hasNextPage) {
        void fetchNextPage();
      }
    }
  };

  return {
    results,
    isEmpty: isDataEmpty,
    isLoading: isDiscoverLoading || isSelectedLoading,
    loadNextPage,
  };
};
