import { useCallback } from 'react';

import { Movie } from '@/app-types/movie';
import { Search } from '@/components/core/search/search';
import useAutocomplete from '@/hooks/autocomplete';

import styles from './autocomplete.module.css';

interface AutocompleteProps {
  query: string;
  selectedQuery: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (selectedQuery: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  query,
  selectedQuery,
  onChange,
  onSelect,
}) => {
  const { autocompleteResults } = useAutocomplete({
    query,
    selectedQuery,
  });

  // Handle selection of the movie name query
  const handleSelect = useCallback(
    (movieName: string) => () => {
      onSelect(movieName);
    },
    [onSelect],
  );

  // Handle Enter key press
  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      handleSelect((event.target as HTMLInputElement).value)();
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
        <button onClick={handleSelect(movieName)}>
          {movieName}

          {releaseDate}
        </button>
      </li>
    );
  };

  return (
    <div className={styles.container}>
      <Search query={query} onChange={onChange} onEnter={onEnter} />

      <ul className={styles.list}>{autocompleteResults.map(renderItem)}</ul>
    </div>
  );
};
