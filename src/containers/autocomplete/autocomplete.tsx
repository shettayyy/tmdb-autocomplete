import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement>(null);

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

  // Handle input focus to show the list and start navigation
  const handleInputFocus = useCallback(() => {
    setIsListOpen(true);
    // Focus the autocomplete list when the input is focused
    if (listRef.current) {
      listRef.current.focus();
    }
  }, []);

  // Handle navigation with arrow keys
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLUListElement>) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prevIndex =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex,
          );
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prevIndex =>
            prevIndex < autocompleteResults.length - 1
              ? prevIndex + 1
              : prevIndex,
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (
            focusedIndex !== -1 &&
            focusedIndex < autocompleteResults.length
          ) {
            const selectedMovie = autocompleteResults[focusedIndex];
            const movieName =
              selectedMovie.name ??
              selectedMovie.title ??
              selectedMovie.original_name ??
              selectedMovie.original_title ??
              'Unknown';
            handleSelect(movieName)();
          }
          break;
        default:
          break;
      }
    },
    [autocompleteResults, focusedIndex, handleSelect],
  );

  // Handle Enter key press
  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      handleSelect((event.target as HTMLInputElement).value)();
    },
    [handleSelect],
  );

  const renderItem = useCallback(
    (item: Movie, index: number) => {
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
          <button
            onClick={handleSelect(movieName)}
            className={`${styles.itemBtn} ${
              focusedIndex === index ? styles.itemHighlight : ''
            }`}
          >
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
    [focusedIndex, handleSelect, query],
  );

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  useEffect(() => {
    setFocusedIndex(-1); // Reset focused index when the list opens or closes
  }, [isListOpen]);

  return (
    <div className={`${styles.container}`}>
      <Search
        query={query}
        onChange={onChange}
        onEnter={onEnter}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
      />

      {isListOpen && (
        <ul
          ref={listRef}
          onKeyDown={handleKeyDown}
          className={styles.list}
          tabIndex={0}
        >
          {autocompleteResults.map(renderItem)}
        </ul>
      )}
    </div>
  );
};
