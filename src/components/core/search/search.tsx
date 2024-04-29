export interface SearchProps {
  query: string;
  setQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Search: React.FC<SearchProps> = ({ query, setQuery }) => {
  return (
    <div>
      <input type="text" value={query} onChange={setQuery} />
    </div>
  );
};
