import { useCallback, useState } from 'react';

import { Movie } from '@/app-types/movie';
import { InfiniteScroll } from '@/components/core/infinite-scroll/infinite-scroll';
import { useMovies } from '@/hooks/movies';

import { Autocomplete } from '../autocomplete/autocomplete';
import styles from './movie-list.module.css';

export const MovieList: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  const { results, isEmpty, isLoading, loadNextPage } =
    useMovies(selectedQuery);

  // Handle search query change event for autocomplete
  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedQuery(prevSelected => {
        if (prevSelected && event.target.value !== '') {
          return '';
        }

        return prevSelected;
      });

      setQuery(event.target.value);
    },
    [],
  );

  // Handle selection of the movie name query
  const handleSelect = (selectedItem: string) => {
    setQuery(selectedItem);
    setSelectedQuery(selectedItem);
  };

  const handleIntersect = () => {
    loadNextPage();
  };

  const renderMovie = useCallback((result: Movie) => {
    const movieName =
      result.name ??
      result.original_name ??
      result.title ??
      result.original_title ??
      'Unknown';

    return <li key={result.id}>{movieName}</li>;
  }, []);

  return (
    <main className={`container ${styles.main}`}>
      <Autocomplete
        query={query}
        selectedQuery={selectedQuery}
        onChange={handleQueryChange}
        onSelect={handleSelect}
      />

      {isLoading && <p>Loading...</p>}
      {isEmpty && <p>No results found</p>}
      {!isLoading && !isEmpty && <ul>{results.map(renderMovie)}</ul>}

      <InfiniteScroll onIntersect={handleIntersect} />
    </main>
  );
};
