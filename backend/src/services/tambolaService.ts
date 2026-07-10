export type ClaimType = 'early_five' | 'top_line' | 'middle_line' | 'bottom_line' | 'full_house';
export type Grid = (number | null)[][];

export function generateTicket(): Grid {
  // Column bands: col 0 → 1-9, col 1 → 10-19, ..., col 7 → 70-79, col 8 → 80-99
  const bands: number[][] = [];
  for (let col = 0; col < 9; col++) {
    const start = col === 0 ? 1 : col * 10;
    const end = col === 8 ? 99 : col * 10 + 9;
    const band: number[] = [];
    for (let n = start; n <= end; n++) band.push(n);
    bands.push(band);
  }

  // Decide column counts: 6 columns get 2 numbers, 3 columns get 1 (total = 15)
  const colCounts = Array(9).fill(1);
  const twoCols = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 6);
  twoCols.forEach((c) => (colCounts[c] = 2));

  // For each column, randomly sample required count from its band
  const colNumbers: number[][] = bands.map((band, col) => {
    return shuffle([...band])
      .slice(0, colCounts[col])
      .sort((a, b) => a - b);
  });

  // Assign numbers to rows with row budget [5,5,5]
  const grid: Grid = Array.from({ length: 3 }, () => Array(9).fill(null));
  const rowBudget = [5, 5, 5];

  for (let col = 0; col < 9; col++) {
    const nums = colNumbers[col];
    if (nums.length === 2) {
      // Assign to two distinct rows with available budget
      const availableRows = [0, 1, 2].filter((r) => rowBudget[r] > 0);
      const [r1, r2] = (() => {
        if (availableRows.length >= 2) {
          const picked = shuffle(availableRows);
          return [picked[0], picked[1]];
        }
        // Fallback: pick the two rows with the highest remaining budget
        const sorted = [0, 1, 2].sort((a, b) => rowBudget[b] - rowBudget[a]);
        return [sorted[0], sorted[1]];
      })();

      // Sort: smaller number in lower row index
      const [low, high] = nums[0] < nums[1] ? [nums[0], nums[1]] : [nums[1], nums[0]];
      const [lowRow, highRow] = r1 < r2 ? [r1, r2] : [r2, r1];

      grid[lowRow][col] = low;
      grid[highRow][col] = high;
      rowBudget[r1]--;
      rowBudget[r2]--;
    } else {
      // Assign to the row with most remaining budget
      const r = rowBudget.indexOf(Math.max(...rowBudget));
      grid[r][col] = nums[0];
      rowBudget[r]--;
    }
  }

  return grid;
}

export function validateClaim(grid: Grid, drawnNumbers: number[], claimType: ClaimType): boolean {
  const drawn = new Set(drawnNumbers);

  const rowMarked = (rowIdx: number): boolean =>
    grid[rowIdx].every((cell) => cell === null || drawn.has(cell));

  const ticketNumbers = grid.flat().filter((n): n is number => n !== null);

  switch (claimType) {
    case 'early_five': {
      const markedCount = ticketNumbers.filter((n) => drawn.has(n)).length;
      return markedCount >= 5;
    }
    case 'top_line':
      return rowMarked(0);
    case 'middle_line':
      return rowMarked(1);
    case 'bottom_line':
      return rowMarked(2);
    case 'full_house':
      return ticketNumbers.every((n) => drawn.has(n));
    default:
      return false;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
