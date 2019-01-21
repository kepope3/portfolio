import React from "react";
import styles from "./../../Assets/CSS/Layout/LinkedInBubble.module.css";
import faceImg from "./../../Assets/Images/me.JPG";

export default () => (
  <div className={styles.bubble}>
    <a
      href="https://www.linkedin.com/in/keith-pope-a83b01133"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img alt="Keith Pope" className={styles.face} src={faceImg} />
      <i className={"fab fa-linkedin " + styles.icon} />
    </a>
  </div>
);
