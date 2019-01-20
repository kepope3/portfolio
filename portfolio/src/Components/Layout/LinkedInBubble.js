import React from "react";
import styles from "./../../Assets/CSS/Layout/LinkedInBubble.module.css";
import faceImg from "./../../Assets/Images/me.JPG";

export default () => (
  <div className={styles.bubble} id="link">
    <img alt="Keith Pope" className={styles.face} src={faceImg} />
  </div>
);
