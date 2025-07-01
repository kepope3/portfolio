// Simple material values for evaluation
const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const MATE_SCORE = 100000;

// Transposition Table (simple Map with FEN+depth key)
const tt = new Map();

// Killer moves table (store top 2 killers per depth)
const killers = {};

// Helper: Detect terminal positions (mate or draw)
function isTerminal(game) {
  return game.in_checkmate() || game.in_stalemate() || game.in_draw();
}

// Helper: Assign scores for mate and draw
function terminalScore(game, depth, isMaximizing) {
  if (game.in_checkmate()) {
    return (isMaximizing ? -1 : 1) * (MATE_SCORE - depth);
  }
  return 0;
}

// Move ordering: captures first (MVV/LVA), then killer moves, then others
function orderedMoves(game, useCapturesFirst = false, depth = 0) {
  const all = game.moves({ verbose: true });
  // assign a score to each move
  const scored = all.map((m) => {
    let score = 0;
    if (useCapturesFirst && m.captured) {
      // MVV/LVA: victim value *100 - attacker value
      score = pieceValues[m.captured] * 100 - (pieceValues[m.piece] || 0);
    } else if (killers[depth]) {
      // killer heuristic for non-captures
      const key = m.san;
      if (killers[depth][0] === key) score = 80;
      else if (killers[depth][1] === key) score = 70;
    }
    return { move: m, score, san: m.san };
  });
  // sort descending by score
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.san);
}

// Evaluate board by material + mobility
export function evaluateBoard(game, mobilityFactor = 0) {
  const board = game.board();
  let total = 0;
  for (let row of board)
    for (let p of row)
      if (p) total += pieceValues[p.type] * (p.color === "w" ? 1 : -1);
  const movesCount = game.moves().length;
  const sign = game.turn() === "w" ? 1 : -1;
  return total + movesCount * mobilityFactor * sign;
}

// Quiescence search
export function quiescence(
  game,
  alpha,
  beta,
  isMaximizing,
  qDepth = 4,
  mobilityFactor = 0
) {
  if (isTerminal(game))
    return {
      score: terminalScore(game, qDepth, isMaximizing),
      move: null,
      line: [],
    };
  const stand = evaluateBoard(game, mobilityFactor);
  if (isMaximizing) alpha = Math.max(alpha, stand);
  else beta = Math.min(beta, stand);
  if (beta <= alpha || qDepth <= 0)
    return { score: stand, move: null, line: [] };
  let caps = game.moves({ verbose: true }).filter((m) => m.captured);
  // MVV/LVA sort
  caps.sort(
    (a, b) =>
      pieceValues[b.captured] - pieceValues[a.captured] ||
      pieceValues[a.piece] - pieceValues[b.piece]
  );
  let best = { score: stand, move: null, line: [] };
  for (let m of caps) {
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
    )
      best = { score: res.score, move: m.san, line: [m.san, ...res.line] };
    if (isMaximizing) alpha = Math.max(alpha, res.score);
    else beta = Math.min(beta, res.score);
    if (beta <= alpha) break;
  }
  return best;
}

// Plain minimax with caching, quiescence, capture ordering
export function minimax(
  game,
  depth,
  isMaximizing,
  useQ = false,
  useMO = false,
  mobilityFactor = 0
) {
  const key = `${game.fen()}|${depth}|${useQ}|${useMO}`;
  if (tt.has(key)) return tt.get(key);
  if (isTerminal(game))
    return {
      score: terminalScore(game, depth, isMaximizing),
      move: null,
      line: [],
    };
  if (depth === 0) {
    const score = useQ
      ? quiescence(game, -Infinity, Infinity, isMaximizing, 4, mobilityFactor)
          .score
      : evaluateBoard(game, mobilityFactor);
    const res = { score, move: null, line: [] };
    tt.set(key, res);
    return res;
  }
  const moves = orderedMoves(game, useMO, depth);
  let best = {
    score: isMaximizing ? -Infinity : Infinity,
    move: null,
    line: [],
  };
  for (let san of moves) {
    game.move(san);
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
    const result = minimax(
      game,
      depth - 1,
      !isMaximizing,
      useQ,
      useMO,
      mobilityFactor
    );
    game.undo();
    if (
      (isMaximizing && result.score > best.score) ||
      (!isMaximizing && result.score < best.score)
    )
      best = { score: result.score, move: san, line: [san, ...result.line] };
  }
  tt.set(key, best);
  return best;
}

// Alpha-beta with caching, captures + killer move ordering
export function alphabeta(
  game,
  depth,
  alpha,
  beta,
  isMaximizing,
  useQ = false,
  useMO = false,
  mobilityFactor = 0
) {
  const key = `${game.fen()}|${depth}|${useQ}|${useMO}`;
  if (tt.has(key)) return tt.get(key);
  if (isTerminal(game))
    return {
      score: terminalScore(game, depth, isMaximizing),
      move: null,
      line: [],
    };
  if (depth === 0) {
    const res = useQ
      ? quiescence(game, alpha, beta, isMaximizing, 4, mobilityFactor)
      : { score: evaluateBoard(game, mobilityFactor), move: null, line: [] };
    tt.set(key, res);
    return res;
  }
  let best = {
    score: isMaximizing ? -Infinity : Infinity,
    move: null,
    line: [],
  };
  const moves = orderedMoves(game, useMO, depth);
  for (let san of moves) {
    // make move and capture move object for heuristics
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
      useQ,
      useMO,
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
      // store killer move if it was not a capture
      if (!moveObj.captured) {
        killers[depth] = killers[depth] || [];
        // prepend and keep top 2
        killers[depth].unshift(san);
        killers[depth] = killers[depth].slice(0, 2);
      }
      break;
    }
  }
  tt.set(key, best);
  return best;
}
