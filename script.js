let board = [];
let solution = [];
let timer = 0;
let interval;

function startTimer() {
  clearInterval(interval);
  timer = 0;
  document.getElementById('timer').textContent = 'Time: 0s';
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = `Time: ${timer}s`;
  }, 1000);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function generatePuzzle() {
  let difficulty = document.getElementById('difficulty').value;
  board = generateBoard(difficulty);
  solution = JSON.parse(JSON.stringify(board));
  fillBoard(solution);
  renderBoard();
  startTimer();
}

function generateBoard(difficulty) {
  let emptyCells = { easy: 40, medium: 50, hard: 60 }[difficulty];
  let b = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(b);
  while (emptyCells > 0) {
    let i = Math.floor(Math.random() * 9);
    let j = Math.floor(Math.random() * 9);
    if (b[i][j] !== 0) {
      b[i][j] = 0;
      emptyCells--;
    }
  }
  return b;
}

function fillBoard(b) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (b[i][j] === 0) {
        let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isValid(b, i, j, num)) {
            b[i][j] = num;
            if (fillBoard(b)) return true;
            b[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(b, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (b[row][i] === num || b[i][col] === num) return false;
  }
  let boxRow = row - row % 3;
  let boxCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (b[boxRow + i][boxCol + j] === num) return false;
    }
  }
  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderBoard() {
  const table = document.getElementById('sudoku-board');
  table.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      if (board[i][j] !== 0) {
        input.value = board[i][j];
        input.disabled = true;
      } else {
        input.value = '';
        input.addEventListener('input', () => {
          const val = parseInt(input.value);
          if (val >= 1 && val <= 9 && isValid(board, i, j, val)) {
            board[i][j] = val;
          } else {
            board[i][j] = 0;
          }
        });
      }
      cell.appendChild(input);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function useHint() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        board[i][j] = solution[i][j];
        renderBoard();
        return;
      }
    }
  }
}

function solveSudoku() {
  board = JSON.parse(JSON.stringify(solution));
  renderBoard();
  clearInterval(interval);
  updateLeaderboard();
}

function updateLeaderboard() {
  const list = document.getElementById('leaderboard');
  const entry = document.createElement('li');
  entry.textContent = `Solved in ${timer} seconds`;
  list.appendChild(entry);
}

generatePuzzle();