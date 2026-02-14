const scoreEl = document.querySelector("#score");
const streakEl = document.querySelector("#streak");
const livesEl = document.querySelector("#lives");
const questionEl = document.querySelector("#question");
const answerInput = document.querySelector("#answer");
const messageEl = document.querySelector("#message");
const submitBtn = document.querySelector("#submit-btn");
const startBtn = document.querySelector("#start-btn");
const nextBtn = document.querySelector("#next-btn");
const resetBtn = document.querySelector("#reset-btn");
const opButtons = document.querySelectorAll(".op-btn");

const cheers = ["잘했어! 🎉", "최고야! ⭐", "정답! 멋져! 💪", "대단해! 🚀"];
const hints = ["조금만 더 생각해보자! 🤔", "괜찮아, 다시 해보자! 😊", "할 수 있어! 🔥"];

let score = 0;
let streak = 0;
let lives = 3;
let currentOp = "add";
let gameStarted = false;
let answer = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperation() {
  if (currentOp !== "mix") {
    return currentOp;
  }

  const ops = ["add", "sub", "mul"];
  return ops[randomInt(0, ops.length - 1)];
}

function makeQuestion() {
  const op = getOperation();
  let a = randomInt(1, 9);
  let b = randomInt(1, 9);
  let text = "";

  if (op === "add") {
    a = randomInt(1, 30);
    b = randomInt(1, 30);
    answer = a + b;
    text = `${a} + ${b} = ?`;
  } else if (op === "sub") {
    a = randomInt(10, 40);
    b = randomInt(1, a);
    answer = a - b;
    text = `${a} - ${b} = ?`;
  } else {
    answer = a * b;
    text = `${a} × ${b} = ?`;
  }

  questionEl.textContent = text;
  answerInput.value = "";
  answerInput.focus();
  nextBtn.disabled = true;
  submitBtn.disabled = false;
}

function updateBoard() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  livesEl.textContent = lives;
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.classList.remove("good", "warn", "bad");
  if (type) {
    messageEl.classList.add(type);
  }
}

function endGame() {
  gameStarted = false;
  questionEl.textContent = "게임 끝! 다시 하기를 눌러 또 도전해요!";
  submitBtn.disabled = true;
  nextBtn.disabled = true;
  setMessage(`최종 점수 ${score}점! 정말 수고했어! 🌈`, "good");
}

startBtn.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    setMessage("좋아! 첫 문제 시작!", "warn");
    makeQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  if (!gameStarted) {
    setMessage("먼저 게임 시작 버튼을 눌러줘!", "warn");
    return;
  }

  const userAnswer = Number(answerInput.value);
  if (Number.isNaN(userAnswer) || answerInput.value.trim() === "") {
    setMessage("숫자를 입력해줘!", "warn");
    return;
  }

  if (userAnswer === answer) {
    score += 10;
    streak += 1;
    const cheer = cheers[randomInt(0, cheers.length - 1)];
    setMessage(`${cheer} +10점`, "good");
  } else {
    lives -= 1;
    streak = 0;
    const hint = hints[randomInt(0, hints.length - 1)];
    setMessage(`아쉬워! 정답은 ${answer}야. ${hint}`, "bad");
  }

  updateBoard();
  submitBtn.disabled = true;

  if (lives <= 0) {
    endGame();
    return;
  }

  nextBtn.disabled = false;
});

nextBtn.addEventListener("click", () => {
  if (gameStarted) {
    makeQuestion();
  }
});

resetBtn.addEventListener("click", () => {
  score = 0;
  streak = 0;
  lives = 3;
  answer = null;
  gameStarted = false;
  updateBoard();
  questionEl.textContent = "시작 버튼을 눌러 게임을 시작해요!";
  answerInput.value = "";
  submitBtn.disabled = false;
  nextBtn.disabled = true;
  setMessage("새로 시작! 이번엔 더 높은 점수에 도전! 😄", "warn");
});

opButtons.forEach((button) => {
  button.addEventListener("click", () => {
    opButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentOp = button.dataset.op;
    if (gameStarted) {
      makeQuestion();
      setMessage("문제 종류를 바꿨어!", "warn");
    }
  });
});

updateBoard();
submitBtn.disabled = false;
