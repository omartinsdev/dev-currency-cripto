import styles from "./header.module.css";

import { Link } from "react-router";

export const Header = () => {
  return (
    <header className={styles.container}>
      <Link to="/">
        <h1 className={styles.logo}>
          Dev<b>Currency</b>
        </h1>
      </Link>
    </header>
  );
};
