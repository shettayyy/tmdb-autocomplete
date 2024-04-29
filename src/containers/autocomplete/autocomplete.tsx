import { Search } from '@/components/core/search/search';
import useAutocomplete from '@/hooks/autocomplete';

import styles from './autocomplete.module.css';

export const Autocomplete: React.FC = () => {
  const { query, result, handleQueryChange } = useAutocomplete();

  return (
    <div className={styles.container}>
      <Search query={query} setQuery={handleQueryChange} />

      <ul className={styles.list}>
        {result.map(item => (
          <li key={item.id} className={styles.item}>
            {item.name ??
              item.title ??
              item.original_name ??
              item.original_title}

            {item.first_air_date ?? item.release_date}
          </li>
        ))}
      </ul>
    </div>
  );
};
