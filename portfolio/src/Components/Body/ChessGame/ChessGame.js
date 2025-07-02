import React, { useState, useCallback, useEffect } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import styles from "../../../Assets/CSS/Body/chessGame.module.css";
import { evaluateBoard, searchRoot } from "./engine";
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

// Thinking and performance stats, plus Copy PGN button
function ThinkingStats({ score, line, movesHistory }) {
  const copyPGN = () => {
    const g = new Chess();
    movesHistory.forEach((san) => g.move(san));
    const pgn = g.pgn();
    navigator.clipboard.writeText(pgn);
  };

  return (
    <div className={styles.thinking}>
      <p>Engine score: {score.toFixed(2)}</p>
      <p>Engine line: {line.join(" ")}</p>
      <button onClick={copyPGN} className={styles.copyButton}>
        Copy PGN
      </button>
    </div>
  );
}

// Main component
export default function ChessGame() {
  // Game state
  const [history, setHistory] = useState([new Chess().fen()]);
  const [movesHistory, setMovesHistory] = useState([]); // SAN list
  const [currentIndex, setCurrentIndex] = useState(0);
  const fen = history[currentIndex];

  // Search settings
  const [time, setTime] = useState(10); // seconds
  const [mf, setMF] = useState(0.005);

  const [showInfo, setShowInfo] = useState(false);

  // Thinking stats
  const [thinkingInfo, setThinkingInfo] = useState({
    score: 0,
    line: [],
  });
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
    if (game.in_checkmate()) {
      setGameOver(true);
      setStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
    } else {
      setGameOver(false);
      setStatus("");
    }
  }, [fen]);

  const canGoBack = !isThinking && currentIndex > 0;
  const canGoForward = !isThinking && currentIndex < history.length - 1;

  const onPieceDrop = useCallback(
    (src, dst) => {
      if (isThinking || gameOver) return false;
      const game = new Chess(fen);
      const move = game.move({ from: src, to: dst, promotion: "q" });
      if (!move) return false;
      const newFen = game.fen();
      setHistory((h) => [...h.slice(0, currentIndex + 1), newFen]);
      setMovesHistory((m) => [...m.slice(0, currentIndex), move.san]);
      setCurrentIndex((i) => i + 1);
      const { score, line } = searchRoot(game, 500, mf);
      setThinkingInfo({ score, line });
      return true;
    },
    [fen, currentIndex, isThinking, gameOver]
  );

  // Engine move handler
  const makeEngineMove = () => {
    if (isThinking || gameOver) return;
    setIsThinking(true);
    const idx = currentIndex;
    setTimeout(() => {
      const game = new Chess(fen);
      const { move: bestMove, score, line } = searchRoot(game, time * 1000, mf);
      if (bestMove) {
        game.move(bestMove);
        const newFen = game.fen();
        setHistory((h) => [...h.slice(0, idx + 1), newFen]);
        setMovesHistory((m) => [...m.slice(0, idx), bestMove]);
        setCurrentIndex((i) => i + 1);
        setThinkingInfo({ score, line });
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
    setMovesHistory([]);
    setCurrentIndex(0);
    setThinkingInfo({ score: evaluateBoard(game), line: [] });
    setGameOver(false);
    setStatus("");
  };

  return (
    <div className={styles.container}>
      {showInfo && (
        <HelpModal title="Engine Overview" onClose={() => setShowInfo(false)}>
          <div className={styles.modalBody}>
            <p>
              I developed this chess engine entirely in JavaScript using{" "}
              <code>chess.js</code> for move validation. It performs
              depth-limited minimax search with α-β pruning, quiescence search,
              and MVV/LVA plus killer-move ordering to efficiently explore
              tactical lines.
            </p>
            <p>
              Quiescence search extends the search at leaf nodes to resolve
              capture sequences until the position “quiets down.” This avoids
              the horizon effect by ensuring the engine doesn’t stop its search
              in the middle of a tactical exchange.
            </p>
            <p>
              The evaluation function is based on material balance and mobility:
              it scores the material difference (with standard piece values)
              plus a small bonus for the number of legal moves available.
            </p>
            <p>
              Increasing Aggression causes the engine to work harder to create
              space for its pieces, making it play more aggressively and pursue
              material.
            </p>
            <p>
              To move a piece, simply drag it to your desired square at any
              time. After moving, the engine makes a short evaluation to display
              a calculated line and score.
            </p>
            <hr />
            <h4>New Optimizations</h4>
            <p>
              <strong>History Heuristic:</strong> The engine tracks which
              non-capturing moves have historically led to β-cuts and boosts
              them in move ordering, so strong “quiet” moves are tried earlier.
            </p>
            <p>
              <strong>Aspiration Windows:</strong> Instead of searching with an
              infinite α/β window each depth, we search within a narrow band
              around the previous iteration’s score (±Δ). If the result falls
              outside, we re-search with the full window—this typically cuts
              down on search effort.
            </p>
            <p>
              <strong>Iterative Deepening & Time Cap:</strong> The engine
              searches depth 1, then 2, then 3… up to your hard ceiling,
              stopping when the timer expires. You always get the deepest
              fully-completed result.
            </p>
            <p>
              <strong>Transposition Table Clearing:</strong> At the start of
              each timed search we clear the TT so all cached results are from
              the current thinking session—this prevents stale entries from
              short‐circuiting a fresh search at a new time cap.
            </p>
            <p>
              <strong>Enhanced Move Ordering:</strong> Moves are now ordered by
              MVV/LVA, killer moves, history scores, and then all others—so the
              most promising moves are examined first, yielding faster α-β
              cutoffs.
            </p>
          </div>
        </HelpModal>
      )}

      <h2>
        <span className={styles.help} onClick={() => setShowInfo(true)}>
          ?
        </span>{" "}
        Chess Engine
      </h2>

      <Controls
        time={time}
        onTimeChange={setTime}
        onMobilityChange={setMF}
        mobilityFactor={mf}
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
        movesHistory={movesHistory}
      />
    </div>
  );
}
