// ========== App State ==========
let currentTopic = null;
let questions = [];
let currentIndex = 0;
let score = 0;
let incorrectQuestions = [];

// ========== DOM Elements ==========
const topicButtons = document.querySelectorAll('.topic-button');
const quizContainer = document.getElementById('quiz-container');
const questionBox = document.getElementById('question-box');
const answersContainer = document.getElementById('answers');
const scoreScreen = document.getElementById('score-screen');
const scoreDetails = document.getElementById('score-details');
const wrongAnswersList = document.getElementById('wrong-answers-list');
const restartBtn = document.getElementById('restart-btn');
const topicSelectSection = document.getElementById('topic-select');
const homeBtn = document.getElementById('home-btn');

// ========== Utility Functions ==========
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Show or hide the Home button
function showHomeButton(show) {
  homeBtn.style.display = show ? 'block' : 'none';
}

// ========== Quiz Setup ==========
function startQuiz(topicKey) {
  currentTopic = topicKey;
  score = 0;
  currentIndex = 0;
  incorrectQuestions = [];

  if (topicKey === "full") {
    questions = [].concat(
      ...(Object.values(questionBank))
    );
  } else {
    questions = questionBank[topicKey] ? [...questionBank[topicKey]] : [];
  }

  questions = shuffleArray(questions).slice(0, 20);

  topicSelectSection.style.display = 'none';
  quizContainer.style.display = 'flex';
  scoreScreen.style.display = 'none';
  showHomeButton(true);

  showQuestion();
}

// ========== Show Question ==========
function showQuestion() {
  if (currentIndex >= questions.length) {
    showScore();
    return;
  }

  let qObj = questions[currentIndex];
  questionBox.textContent = `Q${currentIndex + 1}. ${qObj.q}`;

  let opts = shuffleArray([...qObj.options]);
  answersContainer.innerHTML = '';

  opts.forEach(opt => {
    let btn = document.createElement('button');
    btn.classList.add('answer-option');
    btn.textContent = opt;
    btn.setAttribute('role', 'listitem');
    btn.onclick = () => handleAnswer(opt, qObj.answer, btn);
    answersContainer.appendChild(btn);
  });
}

// ========== Handle Answer ==========
function handleAnswer(selected, correct, btn) {
  Array.from(answersContainer.children).forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('incorrect');
    Array.from(answersContainer.children).forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    incorrectQuestions.push({
      q: questions[currentIndex].q,
      correct: correct,
      yourAnswer: selected
    });
  }

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1500);
}

// ========== Show Score ==========
function showScore() {
  quizContainer.style.display = 'none';
  scoreScreen.style.display = 'block';
  showHomeButton(true);

  let percentage = ((score / questions.length) * 100).toFixed(1);
  scoreDetails.textContent = `You scored ${score} out of ${questions.length} (${percentage}%)`;

  if (incorrectQuestions.length) {
    wrongAnswersList.innerHTML = '';
    incorrectQuestions.forEach((item, idx) => {
      let li = document.createElement('li');
      li.textContent = `Q${idx + 1}: ${item.q} - Correct answer: ${item.correct} (You answered: ${item.yourAnswer})`;
      wrongAnswersList.appendChild(li);
    });
  } else {
    wrongAnswersList.innerHTML = '<li>Excellent! You got all questions correct.</li>';
  }
}

// ========== Restart Quiz ==========
restartBtn.onclick = () => {
  scoreScreen.style.display = 'none';
  topicSelectSection.style.display = 'flex';
  showHomeButton(false);
};

// ========== Home Button ==========
homeBtn.onclick = () => {
  quizContainer.style.display = 'none';
  scoreScreen.style.display = 'none';
  topicSelectSection.style.display = 'flex';
  showHomeButton(false);
};

// ========== Topic Button Listeners ==========
topicButtons.forEach(button => {
  button.onclick = () => startQuiz(button.dataset.topic);
});