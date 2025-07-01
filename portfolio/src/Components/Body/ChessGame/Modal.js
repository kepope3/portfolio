import React from "react";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";

// Generic help modal
export function HelpModal({ title, children, onClose }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        {children}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
