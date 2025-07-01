import React, { useState, useCallback, useEffect } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";
import { alphabeta, minimax, evaluateBoard } from "./engine";
import { Controls } from "./Controls";
import { HelpModal } from "./Modal";

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
  const [depth, setDepth] = useState(2);
  const [mf, setMF] = useState(0.005);
  const [useAB, setUseAB] = useState(true);
  const [useQ, setUseQ] = useState(true);
  const [useMO, setUseMO] = useState(true);

  const [showInfo, setShowInfo] = useState(false);

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
        ? alphabeta(
            game,
            searchDepth,
            -Infinity,
            Infinity,
            isMax,
            useQ,
            useMO,
            mf
          )
        : minimax(game, searchDepth, isMax, useQ, useMO, mf);

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
    }, 10);
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
      {showInfo && (
        <HelpModal title="Engine Overview" onClose={() => setShowInfo(false)}>
          <p>
            I developed this chess engine entirely in JavaScript using{" "}
            <code>chess.js</code> for move validation. It performs depth-limited
            minimax search with α‑β pruning, quiescence search, and MVV/LVA plus
            killer-move ordering to efficiently explore tactical lines.
          </p>
          <p>
            Quiescence Search extends the search at leaf nodes to resolve
            capture sequences until the position quiets down. This avoids the
            horizon effect by ensuring the engine doesn’t stop its search in the
            middle of a tactical exchange.
          </p>
          <p>
            The current evaluation function is based on material balance and
            mobility.
          </p>
        </HelpModal>
      )}

      <h2>
        Chess Engine{" "}
        <span className={styles.help} onClick={() => setShowInfo(true)}>
          ?
        </span>
      </h2>
      <Controls
        onMobilityChange={setMF}
        mobilityFactor={mf}
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
