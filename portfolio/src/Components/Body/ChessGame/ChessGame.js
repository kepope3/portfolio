import React, { useState, useCallback, useEffect } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";
import { alphabeta, minimax, evaluateBoard } from "./engine";

// Generic help modal
function HelpModal({ title, children, onClose }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Game controls: depth buttons, options, move/reset/navigation
function Controls({
  depth,
  useAB,
  useQ,
  useMO,
  onDepthChange,
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

// Chessboard display with overlay
function BoardDisplay({ fen, onDrop, width, overlayText }) {
  return (
    <div className={styles.boardContainer}>
      {overlayText && <div className={styles.overlay}>{overlayText}</div>}
      <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={width} />
    </div>
  );
}

// Thinking and performance stats
function ThinkingStats({ score, line, lastTime, avgTime }) {
  return (
    <div className={styles.thinking}>
      <p>Score: {score.toFixed(2)}</p>
      <p>Line: {line.join(" ")}</p>
      <p>Think time: {lastTime.toFixed(2)} s</p>
      <p>Avg time: {avgTime} s</p>
    </div>
  );
}

// Main component
export default function ChessGame() {
  // Game state
  const [history, setHistory] = useState([new Chess().fen()]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fen = history[currentIndex];

  // Search settings
  const [depth, setDepth] = useState(3);
  const [useAB, setUseAB] = useState(true);
  const [useQ, setUseQ] = useState(true);
  const [useMO, setUseMO] = useState(true);

  // Help modals
  const [showABHelp, setShowABHelp] = useState(false);
  const [showQHelp, setShowQHelp] = useState(false);
  const [showMOHelp, setShowMOHelp] = useState(false);

  // Thinking stats
  const [thinkingInfo, setThinkingInfo] = useState({ score: 0, line: [] });
  const [thinkTime, setThinkTime] = useState(0);
  const [thinkTimes, setThinkTimes] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  // Game status
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("");

  // Responsive board width
  const [boardWidth, setBoardWidth] = useState(
    window.innerWidth <= 600 ? 300 : 500
  );
  useEffect(() => {
    const onResize = () => setBoardWidth(window.innerWidth <= 600 ? 300 : 500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Sync on FEN change
  useEffect(() => {
    const game = new Chess(fen);
    setThinkingInfo((prev) => ({
      score: evaluateBoard(game),
      line: prev.line,
    }));
    if (game.in_checkmate()) {
      setGameOver(true);
      setStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
    } else {
      setGameOver(false);
      setStatus("");
    }
  }, [fen]);

  const avgTime = thinkTimes.length
    ? (thinkTimes.reduce((sum, t) => sum + t, 0) / thinkTimes.length).toFixed(2)
    : "0.00";

  // Compute navigation availability
  const canGoBack = !isThinking && currentIndex > 0;
  const canGoForward = !isThinking && currentIndex < history.length - 1;

  // Handlers
  const onPieceDrop = useCallback((src, dst) => {
    if (isThinking || gameOver) return false;
    const game = new Chess(fen);
    const move = game.move({ from: src, to: dst, promotion: "q" });
    if (!move) return false;
    const newFen = game.fen();
    setHistory((h) => [...h.slice(0, currentIndex + 1), newFen]);
    setCurrentIndex((i) => i + 1);
    setThinkingInfo({ score: evaluateBoard(game), line: [] });
    return true;
  }, [fen, currentIndex, isThinking, gameOver]);

  const makeEngineMove = () => {
    if (isThinking || gameOver) return;
    setIsThinking(true);
    const start = performance.now();
    const idx = currentIndex;
    setTimeout(() => {
      const game = new Chess(fen);
      const isMax = game.turn() === "w";
      const searchDepth = useAB ? depth : Math.min(depth, 3);
      const { move: bestMove, score, line } = useAB
        ? alphabeta(game, searchDepth, -Infinity, Infinity, isMax, useQ, useMO)
        : minimax(game, searchDepth, isMax, useQ, useMO);

      if (bestMove) {
        game.move(bestMove);
        const newFen = game.fen();
        setHistory((h) => [...h.slice(0, idx + 1), newFen]);
        setCurrentIndex((i) => i + 1);
        const elapsed = ((performance.now() - start) / 1000).toFixed(2);
        setThinkingInfo({ score, line });
        setThinkTime(parseFloat(elapsed));
        setThinkTimes((ts) => [...ts, parseFloat(elapsed)]);
      }
      setIsThinking(false);
    }, 50);
  };

  const goBack = () => {
    if (canGoBack) setCurrentIndex((i) => i - 1);
  };
  const goForward = () => {
    if (canGoForward) setCurrentIndex((i) => i + 1);
  };
  const resetGame = () => {
    if (isThinking) return;
    const game = new Chess();
    setHistory([game.fen()]);
    setCurrentIndex(0);
    setThinkingInfo({ score: evaluateBoard(game), line: [] });
    setThinkTime(0);
    setThinkTimes([]);
    setGameOver(false);
    setStatus("");
  };

  const handleDepthChange = (newDepth) => {
    let val = newDepth;
    const limit = useAB ? 5 : 3;
    if (val < 1) val = 1;
    if (val > limit) val = limit;
    setDepth(val);
  };

  return (
    <div className={styles.container}>
      <h2>Chess Game</h2>
      <Controls
        depth={depth}
        useAB={useAB}
        useQ={useQ}
        useMO={useMO}
        onDepthChange={handleDepthChange}
        onToggleAB={(e) => {
          const enabled = e.target.checked;
          setUseAB(enabled);
          if (!enabled && depth > 3) setDepth(3);
        }}
        onToggleQ={(e) => setUseQ(e.target.checked)}
        onToggleMO={(e) => setUseMO(e.target.checked)}
        onMakeMove={makeEngineMove}
        onReset={resetGame}
        onBack={goBack}
        onForward={goForward}
        disableAll={isThinking}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        showABHelp={showABHelp}
        showQHelp={showQHelp}
        showMOHelp={showMOHelp}
        setShowABHelp={setShowABHelp}
        setShowQHelp={setShowQHelp}
        setShowMOHelp={setShowMOHelp}
      />

      <BoardDisplay
        fen={fen}
        onDrop={onPieceDrop}
        width={boardWidth}
        overlayText={
          isThinking || gameOver ? (gameOver ? status : "Thinking...") : null
        }
      />

      <ThinkingStats
        score={thinkingInfo.score}
        line={thinkingInfo.line}
        lastTime={thinkTime}
        avgTime={avgTime}
      />
    </div>
  );
}
