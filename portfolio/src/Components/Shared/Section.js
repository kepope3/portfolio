import React from "react";
import styles from "./../../Assets/CSS/Layout/Section.module.css";

export default ({ backgroundStyle, children }) => (
  <div id="wrapper" style={backgroundStyle} className={styles.section}>
    <div className={styles.children}>
      <div className={"container"}>{children}</div>
    </div>
  </div>
);
