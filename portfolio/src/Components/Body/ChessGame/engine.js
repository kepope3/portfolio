// chessEngine.js

// Simple material values for evaluation
const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const MATE_SCORE = 100000;

// Transposition Table (simple Map with FEN+depth key)
const tt = new Map();

// Killer moves table (store top 2 killers per depth)
const killers = {};

// === Time Control: 1-minute search cap ===
let searchStartTime = 0;
let maxSearchTime = 30 * 1000;
function isOutOfTime() {
  return Date.now() - searchStartTime >= maxSearchTime;
}

// === Helper: Detect terminal positions (mate or draw) ===
function isTerminal(game) {
  return game.in_checkmate() || game.in_stalemate() || game.in_draw();
}

// === Helper: Assign scores for mate and draw ===
function terminalScore(game, depth, isMaximizing) {
  if (game.in_checkmate()) {
    return (isMaximizing ? -1 : 1) * (MATE_SCORE - depth);
  }
  return 0;
}

// === Move ordering: captures first (MVV/LVA), then killer moves, then others ===
function orderedMoves(game, depth = 0) {
  const all = game.moves({ verbose: true });
  const scored = all.map((m) => {
    let score = 0;
    if (m.captured) {
      // MVV/LVA: victim value *100 - attacker value
      score = pieceValues[m.captured] * 100 - (pieceValues[m.piece] || 0);
    } else if (killers[depth]) {
      const key = m.san;
      if (killers[depth][0] === key) score = 80;
      else if (killers[depth][1] === key) score = 70;
    }
    return { move: m, score, san: m.san };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.san);
}

// === Core Evaluation: material + mobility ===
export function evaluateBoard(game, mobilityFactor = 0) {
  const board = game.board();
  let total = 0;
  for (let row of board) {
    for (let p of row) {
      if (p) {
        total += pieceValues[p.type] * (p.color === "w" ? 1 : -1);
      }
    }
  }
  const movesCount = game.moves().length;
  const sign = game.turn() === "w" ? 1 : -1;
  return total + movesCount * mobilityFactor * sign;
}

// === Quiescence search ===
export function quiescence(
  game,
  alpha,
  beta,
  isMaximizing,
  qDepth = 4,
  mobilityFactor = 0
) {
  // bail out if we've exceeded our time budget
  if (isOutOfTime()) {
    return {
      score: evaluateBoard(game, mobilityFactor),
      move: null,
      line: [],
    };
  }

  if (isTerminal(game)) {
    return {
      score: terminalScore(game, qDepth, isMaximizing),
      move: null,
      line: [],
    };
  }

  const stand = evaluateBoard(game, mobilityFactor);
  if (isMaximizing) alpha = Math.max(alpha, stand);
  else beta = Math.min(beta, stand);
  if (beta <= alpha || qDepth <= 0) {
    return { score: stand, move: null, line: [] };
  }

  let best = { score: stand, move: null, line: [] };
  let caps = game.moves({ verbose: true }).filter((m) => m.captured);
  caps.sort(
    (a, b) =>
      pieceValues[b.captured] - pieceValues[a.captured] ||
      pieceValues[a.piece] - pieceValues[b.piece]
  );

  for (let m of caps) {
    if (isOutOfTime()) break;

    game.move(m.san);
    if (game.in_checkmate()) {
      game.undo();
      return {
        score: (isMaximizing ? 1 : -1) * (MATE_SCORE - qDepth),
        move: m.san,
        line: [m.san],
      };
    }

    const res = quiescence(
      game,
      alpha,
      beta,
      !isMaximizing,
      qDepth - 1,
      mobilityFactor
    );
    game.undo();

    if (
      (isMaximizing && res.score > best.score) ||
      (!isMaximizing && res.score < best.score)
    ) {
      best = { score: res.score, move: m.san, line: [m.san, ...res.line] };
    }
    if (isMaximizing) alpha = Math.max(alpha, res.score);
    else beta = Math.min(beta, res.score);
    if (beta <= alpha) break;
  }

  return best;
}

// === Alpha-beta with caching, captures + killer move ordering ===
export function alphabeta(
  game,
  depth,
  alpha,
  beta,
  isMaximizing,
  mobilityFactor = 0
) {
  // bail out if we've exceeded our time budget
  if (isOutOfTime()) {
    return {
      score: evaluateBoard(game, mobilityFactor),
      move: null,
      line: [],
    };
  }

  const key = `${game.fen()}|${depth}`;
  if (tt.has(key)) return tt.get(key);

  if (isTerminal(game)) {
    return {
      score: terminalScore(game, depth, isMaximizing),
      move: null,
      line: [],
    };
  }

  if (depth === 0) {
    const res = quiescence(game, alpha, beta, isMaximizing, 4, mobilityFactor);
    tt.set(key, res);
    return res;
  }

  let best = {
    score: isMaximizing ? -Infinity : Infinity,
    move: null,
    line: [],
  };

  const moves = orderedMoves(game, depth);
  for (let san of moves) {
    if (isOutOfTime()) break;

    const moveObj = game.move(san);
    if (game.in_checkmate()) {
      game.undo();
      const res = {
        score: (isMaximizing ? 1 : -1) * (MATE_SCORE - depth),
        move: san,
        line: [san],
      };
      tt.set(key, res);
      return res;
    }

    const res = alphabeta(
      game,
      depth - 1,
      alpha,
      beta,
      !isMaximizing,
      mobilityFactor
    );
    game.undo();

    const score = res.score;
    if (
      (isMaximizing && score > best.score) ||
      (!isMaximizing && score < best.score)
    ) {
      best = { score, move: san, line: [san, ...res.line] };
    }

    if (isMaximizing) alpha = Math.max(alpha, score);
    else beta = Math.min(beta, score);

    if (beta <= alpha) {
      if (!moveObj.captured) {
        killers[depth] = killers[depth] || [];
        killers[depth].unshift(san);
        killers[depth] = killers[depth].slice(0, 2);
      }
      break;
    }
  }

  tt.set(key, best);
  return best;
}

// === Public Entry Point: time‐capped, iterative‐deepening search ===
/**
 * Think for up to `searchTimeMs` (or until `maxDepth`),
 * returning the best fully‐searched result.
 *
 * @param {Chess} game        chess.js game
 * @param {number} searchTimeMs  time budget in ms
 * @param {number} maxDepth      hard ceiling on depth
 * @param {number} mobilityFactor
 * @returns {{score:number, move:string|null, line:string[]}}
 */
export function searchRoot(
  game,
  searchTimeMs,
  mobilityFactor = 0,
  maxDepth = 10
) {
  // clear old cache, stamp clock
  tt.clear();
  searchStartTime = Date.now();
  maxSearchTime = searchTimeMs;

  // initial “stand‐pat” at depth 0
  let bestResult = {
    score: evaluateBoard(game, mobilityFactor),
    move: null,
    line: [],
  };

  // iterative deepening loop
  for (let depth = 1; depth <= maxDepth; depth++) {
    // bail if no time to start this next iteration
    if (isOutOfTime()) break;

    // run a depth‐limited search to `depth`
    const result = alphabeta(
      game,
      depth,
      -Infinity,
      Infinity,
      game.turn() === "w",
      mobilityFactor
    );

    // if we finished before the timer expired, record it
    if (!isOutOfTime()) {
      bestResult = result;
    } else {
      // time expired *during* this depth → keep previous best
      break;
    }
  }

  return bestResult;
}
