import React from "react";
import List from "../Shared/List";
import styles from "./../../Assets/CSS/Layout/nav.module.css";
export default () => (
  <div className={styles.nav}>
    <List styles={styles} list={["home", "about"]} />
  </div>
);
