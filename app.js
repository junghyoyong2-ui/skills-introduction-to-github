const scoreEl = document.querySelector("#score");
const livesEl = document.querySelector("#lives");
const stepEl = document.querySelector("#step");
const totalStepEl = document.querySelector("#total-step");
const mazeEl = document.querySelector("#maze");
const questionEl = document.querySelector("#question");
const answerInput = document.querySelector("#answer");
const messageEl = document.querySelector("#message");
const submitBtn = document.querySelector("#submit-btn");
const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");

const cheers = ["정답! 한 칸 전진! 🚶", "멋져! 앞으로 가자! 🌟", "좋아! 길이 열렸어! 🎉"];
const hints = ["괜찮아, 다시 생각해보자! 😊", "천천히 해도 좋아! 🤗", "한 번 더 도전! 💪"];

const mazeRows = 7;
const mazeCols = 7;
const path = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 3],
  [3, 3],
  [4, 3],
  [4, 4],
  [4, 5],
  [5, 5],
  [6, 5],
  [6, 6],
];

let score = 0;
let lives = 3;
let gameStarted = false;
let playerIndex = 0;
let answer = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playTone(frequency, duration = 0.12, type = "sine", when = 0) {
  const audioCtx = window.audioCtx || new AudioContext();
  window.audioCtx = audioCtx;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.0001;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime + when;
  gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playCorrectSound() {
  playTone(523, 0.13, "triangle", 0);
  playTone(659, 0.13, "triangle", 0.11);
  playTone(784, 0.15, "triangle", 0.22);
}

function playWrongSound() {
  playTone(260, 0.16, "sawtooth", 0);
  playTone(190, 0.2, "sawtooth", 0.14);
}

function generateQuestion() {
  const op = ["add", "sub", "mul"][randomInt(0, 2)];

  let a = 1;
  let b = 1;

  if (op === "add") {
    a = randomInt(0, 9);
    b = randomInt(0, 9 - a);
    answer = a + b;
    questionEl.textContent = `${a} + ${b} = ?`;
    return;
  }

  if (op === "sub") {
    a = randomInt(1, 9);
    b = randomInt(0, a);
    answer = a - b;
    questionEl.textContent = `${a} - ${b} = ?`;
    return;
  }

  a = randomInt(2, 9);
  b = randomInt(1, 9);
  answer = a * b;
  questionEl.textContent = `${a} × ${b} = ?`;
}

function drawMaze() {
  mazeEl.innerHTML = "";
  const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
  const [playerR, playerC] = path[playerIndex];
  const [startR, startC] = path[0];
  const [goalR, goalC] = path[path.length - 1];

  for (let r = 0; r < mazeRows; r += 1) {
    for (let c = 0; c < mazeCols; c += 1) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const key = `${r},${c}`;
      if (pathSet.has(key)) {
        cell.classList.add("path");
      }

      if (r === startR && c === startC) {
        cell.classList.add("start");
      }

      if (r === goalR && c === goalC) {
        cell.classList.add("goal");
      }

      if (r === playerR && c === playerC) {
        cell.classList.add("player");
      }

      mazeEl.appendChild(cell);
    }
  }
}

function updateBoard() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  stepEl.textContent = playerIndex + 1;
  totalStepEl.textContent = path.length;
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.classList.remove("good", "warn", "bad");
  if (type) {
    messageEl.classList.add(type);
  }
}

function finishGame() {
  gameStarted = false;
  submitBtn.disabled = true;
  const reachedGoal = playerIndex === path.length - 1;

  if (reachedGoal) {
    setMessage(`도착 성공! 점수 ${score}점! 정말 잘했어! 🏁`, "good");
    questionEl.textContent = "미로 탈출 성공! 다시 하기로 또 해보자!";
  } else {
    setMessage(`기회가 다 됐어. 점수 ${score}점! 다시 도전해보자!`, "bad");
    questionEl.textContent = "아쉬워! 다시 하기를 누르면 새로 시작해요.";
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  playerIndex = 0;
  answer = null;
  gameStarted = false;

  updateBoard();
  drawMaze();
  questionEl.textContent = "게임 시작을 누르면 첫 문제가 나와요!";
  answerInput.value = "";
  submitBtn.disabled = false;
  setMessage("준비 완료! 시작 버튼을 눌러보자! 😄", "warn");
}

startBtn.addEventListener("click", async () => {
  if (gameStarted) {
    setMessage("이미 게임 중이야! 문제를 풀어보자!", "warn");
    return;
  }

  gameStarted = true;
  if (window.audioCtx && window.audioCtx.state === "suspended") {
    await window.audioCtx.resume();
  }

  generateQuestion();
  answerInput.focus();
  setMessage("좋아! 정답을 맞히면 앞으로 갈 수 있어!", "warn");
});

submitBtn.addEventListener("click", () => {
  if (!gameStarted) {
    setMessage("먼저 게임 시작 버튼을 눌러줘!", "warn");
    return;
  }

  const userAnswer = Number(answerInput.value);
  if (answerInput.value.trim() === "" || Number.isNaN(userAnswer)) {
    setMessage("숫자를 입력해줘!", "warn");
    return;
  }

  if (userAnswer === answer) {
    score += 10;
    playerIndex += 1;
    playCorrectSound();
    setMessage(cheers[randomInt(0, cheers.length - 1)], "good");
  } else {
    lives -= 1;
    playWrongSound();
    setMessage(`틀렸어! 정답은 ${answer}. ${hints[randomInt(0, hints.length - 1)]}`, "bad");
  }

  answerInput.value = "";
  drawMaze();
  updateBoard();

  if (playerIndex >= path.length - 1) {
    playerIndex = path.length - 1;
    drawMaze();
    finishGame();
    return;
  }

  if (lives <= 0) {
    finishGame();
    return;
  }

  generateQuestion();
  answerInput.focus();
});

resetBtn.addEventListener("click", () => {
  resetGame();
});

resetGame();
