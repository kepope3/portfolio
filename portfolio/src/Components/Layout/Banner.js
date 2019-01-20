import React from "react";
import styles from "./../../Assets/CSS/Layout/BannerImg.module.css";

export default ({ imgSrc }) => (
  <img
    id="backgroundImage"
    src={imgSrc}
    className={styles.banner}
    alt="banner_image"
  />
);
