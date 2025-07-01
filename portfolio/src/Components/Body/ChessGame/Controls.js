import React from "react";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";
import { HelpModal } from "./Modal";

// Game controls: depth buttons, options, move/reset/navigation
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
        <span
          className={styles.depthDisplay}
          style={{ margin: "0 2px" }}
        >{` ${displayMF} `}</span>
        <button
          onClick={() => onMobilityChange(mobilityFactor + 0.005)}
          disabled={disableAll}
        >
          +
        </button>
      </label>

      <label>
        <input
          type="checkbox"
          checked={useAB}
          onChange={onToggleAB}
          disabled={disableAll}
        />{" "}
        Use alpha-beta pruning
        <span className={styles.help} onClick={() => setShowABHelp(true)}>
          ?
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={useQ}
          onChange={onToggleQ}
          disabled={disableAll}
        />{" "}
        Use quiescence search
        <span className={styles.help} onClick={() => setShowQHelp(true)}>
          ?
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          checked={useMO}
          onChange={onToggleMO}
          disabled={disableAll}
        />{" "}
        Use move ordering
        <span className={styles.help} onClick={() => setShowMOHelp(true)}>
          ?
        </span>
      </label>

      <button onClick={onMakeMove} disabled={disableAll}>
        {disableAll ? "Thinking..." : "Make Move"}
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
          title="Alpha-Beta Pruning"
          onClose={() => setShowABHelp(false)}
        >
          <p>
            Alpha-Beta pruning skips branches that cannot influence the final
            minimax result, dramatically reducing the search tree.
          </p>
          <pre
            className={styles.modalBody}
          >{`// engine.js :\nexport function alphabeta(
            game,
            depth,
            alpha,
            beta,
            isMaximizing,
            useQ = false,
            useMO = false
          ) {
            if (depth === 0) {
              return useQ
                ? quiescence(game, alpha, beta, isMaximizing)
                : { score: evaluateBoard(game), move: null, line: [] };
            }
            if (game.game_over()) {
              return { score: evaluateBoard(game), move: null, line: [] };
            }
          
            // move ordering: captures first
            const moves = orderedMoves(game, useMO);
            let best = { score: null, move: null, line: [] };
          
            for (let mSan of moves) {
              game.move(mSan);
              const result = alphabeta(game, depth - 1, alpha, beta, !isMaximizing, useQ);
              game.undo();
          
              const currentScore = result.score;
              if (
                best.move === null ||
                (isMaximizing && currentScore > best.score) ||
                (!isMaximizing && currentScore < best.score)
              ) {
                best = { score: currentScore, move: mSan, line: [mSan, ...result.line] };
              }
              if (isMaximizing) alpha = Math.max(alpha, currentScore);
              else beta = Math.min(beta, currentScore);
              if (beta <= alpha) break;
            }
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
            Resolves tactical captures at leaf nodes to avoid the horizon
            effect.
          </p>
          <pre
            className={styles.modalBody}
          >{`// engine.js:\n export function quiescence(game, alpha, beta, isMaximizing, qDepth = 4) {
            const standPat = evaluateBoard(game);
            if (isMaximizing) alpha = Math.max(alpha, standPat);
            else beta = Math.min(beta, standPat);
            if (beta <= alpha || qDepth <= 0) {
              return { score: standPat, move: null, line: [] };
            }
          
            let captures = game.moves({ verbose: true }).filter((m) => m.captured);
            // sort captures: MVV/LVA
            captures.sort((a, b) => {
              const vA = pieceValues[a.captured];
              const vB = pieceValues[b.captured];
              return vB - vA;
            });
          
            let best = { score: standPat, move: null, line: [] };
            for (let m of captures) {
              game.move(m.san);
              const result = quiescence(game, alpha, beta, !isMaximizing, qDepth - 1);
              game.undo();
          
              const currentScore = result.score;
              if (
                (isMaximizing && currentScore > best.score) ||
                (!isMaximizing && currentScore < best.score)
              ) {
                best = {
                  score: currentScore,
                  move: m.san,
                  line: [m.san, ...result.line],
                };
              }
              if (isMaximizing) alpha = Math.max(alpha, currentScore);
              else beta = Math.min(beta, currentScore);
              if (beta <= alpha) break;
            }
            return best;
          }`}</pre>
        </HelpModal>
      )}

      {showMOHelp && (
        <HelpModal title="Move Ordering" onClose={() => setShowMOHelp(false)}>
          <p>
            Move ordering gives your search algorithm the “best” moves first so
            that alpha-beta pruning can cut off the rest earlier.
          </p>
          <pre
            className={styles.modalBody}
          >{`// engine.js:\n function orderedMoves(game, isEnabled = false) {
  const all = game.moves({ verbose: true });

  if (!isEnabled) {
    return all.map((m) => m.san);
  }

  const caps = all
    .filter((m) => m.captured)
    .sort((a, b) => pieceValues[b.captured] - pieceValues[a.captured]);
  const nonCaps = all.filter((m) => !m.captured);
  return [...caps, ...nonCaps].map((m) => m.san);
}`}</pre>
        </HelpModal>
      )}
    </div>
  );
}
