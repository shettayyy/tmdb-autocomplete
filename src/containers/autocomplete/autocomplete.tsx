import { useCallback, useEffect, useState } from 'react';

import { Movie } from '@/app-types/movie';
import { Search } from '@/components/core/search/search';
import useAutocomplete from '@/hooks/autocomplete';

import styles from './autocomplete.module.css';

interface AutocompleteProps {
  query: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (selectedQuery: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  query,
  onChange,
  onSelect,
}) => {
  const { autocompleteResults } = useAutocomplete({
    query,
  });
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  // Close the list when clicking outside
  const handleDocumentClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const container = document.querySelector(`.${styles.container}`);
    if (container && !container.contains(target)) {
      setIsListOpen(false);
    }
  }, []);

  // Handle selection of the movie name query
  const handleSelect = useCallback(
    (movieName: string) => () => {
      onSelect(movieName);
      setIsListOpen(false);
    },
    [onSelect],
  );

  // Handle input focus to show the list
  const handleInputFocus = useCallback(() => {
    setIsListOpen(true);
  }, []);

  // Handle Enter key press
  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      handleSelect((event.target as HTMLInputElement).value)();
    },
    [handleSelect],
  );

  const renderItem = useCallback(
    (item: Movie) => {
      const movieName =
        item.name ??
        item.title ??
        item.original_name ??
        item.original_title ??
        'Unknown';
      const releaseDate = item.first_air_date ?? item.release_date;

      // Split the movie name into segments based on the query
      const segments = movieName.split(new RegExp(`(${query})`, 'gi'));

      return (
        <li key={item.id} className={styles.item}>
          <button onClick={handleSelect(movieName)} className={styles.itemBtn}>
            <span className={styles.itemName}>
              {segments.map((segment, index) => (
                <span
                  key={index}
                  className={
                    segment.toLowerCase() === query.toLowerCase()
                      ? styles.highlight
                      : ''
                  }
                >
                  {segment}
                </span>
              ))}
            </span>

            <span className={styles.itemDate}>
              {releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown'}
            </span>
          </button>
        </li>
      );
    },
    [handleSelect, query],
  );

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  return (
    <div className={`${styles.container}`}>
      <Search
        query={query}
        onChange={onChange}
        onEnter={onEnter}
        onFocus={handleInputFocus}
      />

      {isListOpen && (
        <ul className={styles.list}>{autocompleteResults.map(renderItem)}</ul>
      )}
    </div>
  );
};
