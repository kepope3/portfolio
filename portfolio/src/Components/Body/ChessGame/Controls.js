import React from "react";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";

export function Controls({
  depth,
  useAB,
  onDepthChange,
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
  const maxDepth = useAB ? 5 : 3;
  const displayMF = parseFloat(mobilityFactor.toFixed(3));

  return (
    <div className={styles.controls}>
      <label>
        Level (Depth):
        <button
          style={{ marginLeft: "0.25rem" }}
          onClick={() => onDepthChange(depth - 1)}
          disabled={disableAll || depth <= 1}
        >
          -
        </button>
        <span className={styles.depthDisplay}>{` ${depth} `}</span>
        <button
          onClick={() => onDepthChange(depth + 1)}
          disabled={disableAll || depth >= maxDepth}
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
