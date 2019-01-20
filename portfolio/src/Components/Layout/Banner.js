import React from "react";
import backgroundImg from "./../../Assets/Images/banner_img.JPG";
import styles from "./../../Assets/CSS/Layout/BannerImg.module.css";

export default () => (
  <img
    id="backgroundImage"
    src={backgroundImg}
    className={styles.banner}
    alt="banner_image"
  />
);
