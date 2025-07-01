import React from "react";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";
import { HelpModal } from "./Modal";

// Game controls: depth buttons, aggression toggle, feature checkboxes, and navigation
export function Controls({
  depth,
  useAB,
  useQ,
  useMO,
  onDepthChange,
  onMobilityChange,
  mobilityFactor,
  onToggleAB,
  onToggleQ,
  onToggleMO,
  onMakeMove,
  onReset,
  onBack,
  onForward,
  disableAll,
  canGoBack,
  canGoForward,
  showABHelp,
  showQHelp,
  showMOHelp,
  setShowABHelp,
  setShowQHelp,
  setShowMOHelp,
}) {
  const maxDepth = useAB ? 5 : 3;
  const displayMF = parseFloat(mobilityFactor.toFixed(3));

  return (
    <div className={styles.controls}>
      <label>
        Depth:
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
        Aggression:
        <button
          style={{ marginLeft: "0.25rem" }}
          onClick={() => onMobilityChange(mobilityFactor - 0.005)}
          disabled={disableAll}
        >
          -
        </button>
        <span className={styles.depthDisplay} style={{ margin: "0 2px" }}>
          {` ${displayMF} `}
        </span>
        <button
          onClick={() => onMobilityChange(mobilityFactor + 0.005)}
          disabled={disableAll}
        >
          +
        </button>
      </label>

      {/* <label>
        <input
          type="checkbox"
          checked={useAB}
          onChange={onToggleAB}
          disabled={disableAll}
        />{" "}
        Use Alpha‑Beta Pruning & Caching
        <span className={styles.help} onClick={() => setShowABHelp(true)}>
          ?
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={useQ}
          onChange={onToggleQ}
          disabled={disableAll || !useAB}
        />{" "}
        Use Quiescence Search
        <span className={styles.help} onClick={() => setShowQHelp(true)}>
          ?
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={useMO}
          onChange={onToggleMO}
          disabled={disableAll || !useAB}
        />{" "}
        Use Move Ordering (MVV/LVA & Killers)
        <span className={styles.help} onClick={() => setShowMOHelp(true)}>
          ?
        </span>
      </label> */}

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

      {showABHelp && (
        <HelpModal
          title="Alpha‑Beta Pruning & Caching"
          onClose={() => setShowABHelp(false)}
        >
          <p>
            When enabled, the engine applies α‑β pruning <em>and</em> a
            Transposition Table to cache previous positions. This combination
            skips irrelevant branches and never re-searches the same FEN+depth,
            dramatically reducing the tree size.
          </p>
          <pre className={styles.modalBody}>{`// Key snippet in engine.js:
  export function alphabeta(game, depth, alpha, beta, isMaximizing, useQ=false, useMO=false) {
    const key = \`\${game.fen()}|\${depth}|\${useQ}|\${useMO}\`;
    if (tt.has(key)) return tt.get(key);
    // ... alpha-beta loop with pruning ...
    tt.set(key, best);
    return best;
  }`}</pre>
        </HelpModal>
      )}

      {showQHelp && (
        <HelpModal
          title="Quiescence Search"
          onClose={() => setShowQHelp(false)}
        >
          <p>
            Resolves only capture sequences past the fixed depth to avoid the
            horizon effect. Requires α‑β pruning to be enabled.
          </p>
          <pre className={styles.modalBody}>{`// engine.js:
  export function quiescence(game, alpha, beta, isMaximizing, qDepth = 4) {
    const stand = evaluateBoard(game);
    // update alpha/beta, then generate only captures (MVV/LVA)
    // recursive quiescence until qDepth = 0 or no good captures
  }`}</pre>
        </HelpModal>
      )}

      {showMOHelp && (
        <HelpModal title="Move Ordering" onClose={() => setShowMOHelp(false)}>
          <p>
            Improves pruning by trying the strongest moves first:
            <ul>
              <li>
                <strong>MVV/LVA</strong> for capture ordering.
              </li>
              <li>
                <strong>Killer moves</strong> (quiet moves that caused previous
                cutoffs).
              </li>
            </ul>
            Requires α‑β pruning to be enabled.
          </p>
          <pre className={styles.modalBody}>{`// engine.js:
  function orderedMoves(game, useMO, depth) {
    // score = MVV/LVA for captures, killer heuristic for quiet moves
    // sort by score descending
  }`}</pre>
        </HelpModal>
      )}
    </div>
  );
}
