import { useCallback } from 'react';

import styles from './search.module.css';

export interface SearchProps {
  query: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Search: React.FC<SearchProps> = ({ query, onChange, onEnter }) => {
  const handleEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.currentTarget.blur();

        onEnter?.(event);
      }
    },
    [onEnter],
  );

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={query}
        onChange={onChange}
        onKeyUp={handleEnter}
        placeholder="Search movies..."
        className={styles.input}
      />

      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
};
