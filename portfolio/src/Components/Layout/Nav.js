import React from "react";
import List from "../Shared/List";
import styles from "./../../Assets/CSS/Layout/nav.module.css";
export default () => (
  <div className={styles.nav}>
    <List
      styles={styles}
      list={[
        <a href="#home">Home</a>,
        <a href="#about">About</a>,
        <a href="#resume">Resume</a>,
        <a href="#portfolio">Portfolio</a>,
        <a href="#contact">Contact</a>
      ]}
    />
  </div>
);
