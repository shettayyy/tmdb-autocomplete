import { useCallback } from 'react';

import { Movie } from '@/app-types/movie';
import { Search } from '@/components/core/search/search';
import useAutocomplete from '@/hooks/autocomplete';

import styles from './autocomplete.module.css';

export const Autocomplete: React.FC = () => {
  const { query, result, handleQueryChange, handleSelect } = useAutocomplete();

  const onSelect = useCallback(
    (movieName: string) => () => {
      handleSelect(movieName);
    },
    [handleSelect],
  );

  const renderItem = (item: Movie) => {
    const movieName =
      item.name ??
      item.title ??
      item.original_name ??
      item.original_title ??
      'Unknown';
    const releaseDate = item.first_air_date ?? item.release_date;

    return (
      <li key={item.id} className={styles.item}>
        <button onClick={onSelect(movieName)}>
          {movieName}

          {releaseDate}
        </button>
      </li>
    );
  };

  return (
    <div className={styles.container}>
      <Search query={query} setQuery={handleQueryChange} />

      <ul className={styles.list}>{result.map(renderItem)}</ul>
    </div>
  );
};
