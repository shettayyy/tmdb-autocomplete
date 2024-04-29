import styles from './header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={`${styles.header}`}>
      <div className={`container ${styles.wrapper}`}>
        <a href="/" className={styles.logo}>
          <img src="/logo.png" alt="Logo" className="img" />
        </a>

        <span className={styles.tagline}>
          Made with <span className={styles.heart}>❤️ </span>
          for{' '}
          <a
            href="https://www.deel.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.companyName}
          >
            Deel
          </a>
        </span>
      </div>
    </header>
  );
};
