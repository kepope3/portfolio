import React from "react";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";

export function Controls({
  time,
  onTimeChange,
  onMobilityChange,
  mobilityFactor,
  onMakeMove,
  onReset,
  onBack,
  onForward,
  disableAll,
  canGoBack,
  canGoForward,
}) {
  const maxTime = 120;
  const displayMF = parseFloat(mobilityFactor.toFixed(3));

  return (
    <div className={styles.controls}>
      <label>
        Time (in seconds):
        <button
          style={{ marginLeft: "0.25rem" }}
          onClick={() => onTimeChange(time > 5 ? time - 5 : 5)}
          disabled={disableAll || time <= 1}
        >
          -
        </button>
        <span className={styles.depthDisplay}>{` ${time} `}</span>
        <button
          onClick={() => onTimeChange(time + 5)}
          disabled={disableAll || time >= maxTime}
        >
          +
        </button>
      </label>

      <label>
        Aggression (Mobility Factor):
        <button
          style={{ marginLeft: "0.25rem" }}
          onClick={() => onMobilityChange(mobilityFactor - 0.005)}
          disabled={disableAll}
        >
          -
        </button>
        <span className={styles.depthDisplay} style={{ margin: "0 4px" }}>
          {` ${displayMF} `}
        </span>
        <button
          onClick={() => onMobilityChange(mobilityFactor + 0.005)}
          disabled={disableAll}
        >
          +
        </button>
      </label>
      <button
        onClick={onMakeMove}
        disabled={disableAll}
        style={{ background: "#3dd164" }}
      >
        Execute Engine Move
      </button>
      <button onClick={onReset} disabled={disableAll}>
        Reset
      </button>
      <button onClick={onBack} disabled={!canGoBack}>
        ←
      </button>
      <button onClick={onForward} disabled={!canGoForward}>
        →
      </button>
    </div>
  );
}
