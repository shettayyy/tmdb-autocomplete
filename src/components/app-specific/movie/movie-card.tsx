import { Movie } from '@/app-types/movie';

import styles from './movie-card.module.css';

export interface MovieProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieProps> = ({ movie }) => {
  const movieName =
    movie.name ??
    movie.original_name ??
    movie.title ??
    movie.original_title ??
    'Unknown';
  const overview = movie.overview || 'No overview available';

  // Ellipsis for long overview, cutting off at 200 characters
  const overviewText =
    overview.length > 200 ? `${overview.slice(0, 200)}...` : overview;

  return (
    <div className={styles.movieCard}>
      <div className={styles.posterContainer}>
        {
          // Display the movie poster if available
          movie.poster_path ? (
            <img
              className={styles.poster}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster for ${movieName}`}
            />
          ) : (
            <img
              className={styles.poster}
              src="https://via.placeholder.com/500X750"
              alt="Placeholder for missing movie poster"
            />
          )
        }
      </div>

      <div className={styles.info}>
        <h2 className={styles.movieName}>{movieName}</h2>
        <p className={styles.overview}>{overviewText}</p>
      </div>
    </div>
  );
};
