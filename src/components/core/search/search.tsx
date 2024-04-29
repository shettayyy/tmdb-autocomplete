import { useCallback } from 'react';

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
    <div>
      <input
        type="text"
        value={query}
        onChange={onChange}
        onKeyUp={handleEnter}
      />
    </div>
  );
};
