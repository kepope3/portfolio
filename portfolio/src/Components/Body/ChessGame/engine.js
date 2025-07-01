// Simple material values for evaluation
const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

// Optional: simple move ordering (captures first)
function orderedMoves(game, isEnabled = false) {
  const all = game.moves({ verbose: true });

  if (!isEnabled) {
    return all.map((m) => m.san);
  }

  const caps = all
    .filter((m) => m.captured)
    .sort((a, b) => pieceValues[b.captured] - pieceValues[a.captured]);
  const nonCaps = all.filter((m) => !m.captured);
  return [...caps, ...nonCaps].map((m) => m.san);
}

// Evaluate board by material balance (white positive)
export function evaluateBoard(game) {
  const board = game.board();
  let total = 0;
  for (let row of board) {
    for (let piece of row) {
      if (piece) {
        const value = pieceValues[piece.type] || 0;
        total += piece.color === "w" ? value : -value;
      }
    }
  }
  return total;
}

// Quiescence search: only consider capture moves to avoid horizon effect
export function quiescence(game, alpha, beta, isMaximizing, qDepth = 4) {
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
}

// Plain minimax with optional quiescence and optional Transposition Table
export function minimax(
  game,
  depth,
  isMaximizing,
  useQ = false,
  useMO = false
) {
  const alphaInit = -Infinity;
  const betaInit = Infinity;
  if (depth === 0) {
    const evalScore = useQ
      ? quiescence(game, alphaInit, betaInit, isMaximizing).score
      : evaluateBoard(game);
    return { score: evalScore, move: null, line: [] };
  }
  if (game.game_over()) {
    return { score: evaluateBoard(game), move: null, line: [] };
  }

  // move ordering if desired
  const moves = orderedMoves(game, useMO);
  let best = { score: null, move: null, line: [] };
  for (let mSan of moves) {
    game.move(mSan);
    const result = minimax(game, depth - 1, !isMaximizing, useQ);
    game.undo();

    const currentScore = result.score;
    if (
      best.move === null ||
      (isMaximizing && currentScore > best.score) ||
      (!isMaximizing && currentScore < best.score)
    ) {
      best = { score: currentScore, move: mSan, line: [mSan, ...result.line] };
    }
  }
  return best;
}

// Minimax with alpha-beta and optional Transposition Table
export function alphabeta(
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
}
