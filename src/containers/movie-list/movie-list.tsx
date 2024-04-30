import { useCallback, useState } from 'react';

import { Movie } from '@/app-types/movie';
import { MovieCard } from '@/components/app-specific/movie/movie-card';
import { InfiniteScroll } from '@/components/core/infinite-scroll/infinite-scroll';
import { useMovies } from '@/hooks/movies';

import { Autocomplete } from '../autocomplete/autocomplete';
import styles from './movie-list.module.css';

export const MovieList: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<string>('');

  const { results, isEmpty, isLoading, loadNextPage } = useMovies(
    query,
    selectedQuery,
  );

  // Handle search query change event for autocomplete
  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);

      if (event.target.value === '') {
        setSelectedQuery('');
      }
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

  const renderMovie = useCallback((result: Movie, index: number) => {
    // The API sometimes returns a movie with the same ID
    return <MovieCard key={`${result.id}+${index}`} movie={result} />;
  }, []);

  const renderPlaceholderCards = () => {
    return (
      <ul className={styles.list}>
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCard
            movie={{
              id: index,
              name: '',
              original_name: '',
              title: '',
              original_title: '',
              overview: '',
              poster_path: '',
              backdrop_path: '',
              adult: false,
              genre_ids: [],
              popularity: 0,
              vote_average: 0,
              media_type: '',
              release_date: '',
              origin_country: [],
              original_language: '',
              vote_count: 0,
              first_air_date: '',
            }}
            key={index}
            isLoading
          />
        ))}
      </ul>
    );
  };

  return (
    <main className={`container ${styles.main}`}>
      <Autocomplete
        query={query}
        onChange={handleQueryChange}
        onSelect={handleSelect}
      />

      {isLoading && renderPlaceholderCards()}
      {isEmpty && <p>No results found</p>}
      {!isLoading && !isEmpty && (
        <ul className={styles.list}>{results.map(renderMovie)}</ul>
      )}

      <InfiniteScroll onIntersect={handleIntersect} />
    </main>
  );
};
