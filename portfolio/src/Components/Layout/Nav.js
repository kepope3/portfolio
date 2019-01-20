import React from "react";
import List from "../Shared/List";
import styles from "./../../Assets/CSS/Layout/nav.module.css";
export default () => (
  <List className={styles.nav} styles={styles} list={["home", "about"]} />
);
