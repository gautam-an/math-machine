let currentStreak = 0;
let highestStreak = parseInt(localStorage.getItem('highestStreak')) || 0;
let currentProblem = {};
let timerInterval;
let secondsElapsed = 0;

window.onload = () => {
  document.getElementById('highest-streak').textContent = highestStreak;
  setupEventListeners();
  startTimer();
  generateProblem();
};

function startTimer() {
  secondsElapsed = 0;
  updateTimerDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const min = Math.floor(secondsElapsed / 60);
  const sec = secondsElapsed % 60;
  document.getElementById('timer').textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function onrange() {
  currentStreak = 0;
  document.getElementById('current-streak').textContent = currentStreak;
  generateProblem();
}

function setupEventListeners() {
  document.getElementById('number-range-1').addEventListener('change', onrange);
  document.getElementById('number-range-2').addEventListener('change', onrange);

  document.getElementById('answer').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });
}

function generateProblem() {
  const [min1, max1] = getrange('number-range-1');
  const [min2, max2] = getrange('number-range-2');

  const num1 = getrandint(min1, max1);
  let num2 = getrandint(min2, max2);
  const operations = ['+', '-', '×', '÷'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer;

  if (operation === '÷') {
    num2 = Math.max(1, num2); 
    const product = num1 * num2;
    currentProblem = {
      num1: product,
      num2,
      operation,
      answer: product / num2
    };
  } else if (operation === '-') {
    const a = Math.max(num1, num2);
    const b = Math.min(num1, num2);
    currentProblem = {
      num1: a,
      num2: b,
      operation,
      answer: a - b
    };
  } else {
    answer = calc(num1, num2, operation);
    currentProblem = { num1, num2, operation, answer };
  }

  const eq = `${format(currentProblem.num1)} ${currentProblem.operation} ${format(currentProblem.num2)}`;
  document.getElementById('equation').textContent = eq;
  document.getElementById('answer').value = '';
  document.getElementById('feedback').textContent = '';
  startTimer();
}

function checkAnswer() {
  const input = document.getElementById('answer').value;
  const userAnswer = parseFloat(input);
  const feedback = document.getElementById('feedback');

  if (isNaN(userAnswer)) {
    feedback.textContent = 'please enter a number.';
    feedback.className = 'feedback error';
    return;
  }

  const correct = Math.abs(userAnswer - currentProblem.answer) < 0.01;

  if (correct) {
    currentStreak++;
    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
      localStorage.setItem('highestStreak', highestStreak);
    }
    feedback.textContent = '';
    feedback.className = 'feedback';
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('highest-streak').textContent = highestStreak;
    generateProblem();
  } else {
    currentStreak = 0;
    feedback.textContent = 'wrong, try again';
    feedback.className = 'feedback error';
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('highest-streak').textContent = highestStreak;
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'feedback';
    }, 2000);
  }
}

function calc(num1, num2, op) {
  switch (op) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case '×': return num1 * num2;
    case '÷': return num1 / num2;
  }
}

function getrange(selectId) {
  const option = document.getElementById(selectId).selectedOptions[0];
  const min = parseInt(option.getAttribute('data-min'));
  const max = parseInt(option.getAttribute('data-max'));
  return [min, max];
}

function getrandint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function format(n) {
  return n.toLocaleString();
}
