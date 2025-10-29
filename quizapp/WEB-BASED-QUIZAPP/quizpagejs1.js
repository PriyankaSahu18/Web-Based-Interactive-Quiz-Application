/* quiz.js*/
// Check if user is logged in
function checkLoginStatus() { 
  if (!localStorage.getItem("loggedIn")) {
      alert("You need to log in first.");
      window.location.href = "learninglogin.html"; // Redirect to login
  }
}

window.onload = checkLoginStatus; // Check login status on loading

const progressBar = document.querySelector(".progress-bar"),
progressText = document.querySelector(".progress-text");

const progress = (value) => {
const percentage = (value / time) * 100;
progressBar.style.width = `${percentage}%`;
progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
numQuestions = document.querySelector("#num-questions"),
category = document.querySelector("#category"),
difficulty = document.querySelector("#difficulty"),
quiz = document.querySelector(".quiz"),
startScreen = document.querySelector(".start-screen");

let questions = [],
time = 30,
score = 0,
currentQuestion,
timer,
answered = false;

// Function to get time based on difficulty
const getTimeByDifficulty = (difficulty) => {
switch (difficulty) {
  case 'easy':
    return 10; // 10 seconds for easy
  case 'medium':
    return 13; // 13 seconds for medium
  case 'hard':
    return 15; // 15 seconds for hard
  default:
    return 20; // Default time
}
};

const startQuiz = () => {
const num = numQuestions.value,
  cat = category.value,
  diff = difficulty.value;

loadingAnimation();

// Set time based on difficulty level
time = getTimeByDifficulty(diff);

const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    questions = data.results;
    setTimeout(() => {
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      currentQuestion = 1;
      showQuestion(questions[0]);
    }, 1000);
  });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
// Clear any previous timer
clearInterval(timer);
answered = false; // Reset answered status for the new question

const questionText = document.querySelector(".question"),
  answersWrapper = document.querySelector(".answer-wrapper");
const questionNumber = document.querySelector(".number");

questionText.innerHTML = question.question;

const answers = [
  ...question.incorrect_answers,
  question.correct_answer.toString(),
];
answersWrapper.innerHTML = "";
answers.sort(() => Math.random() - 0.5);
answers.forEach((answer) => {
  answersWrapper.innerHTML += `
    <div class="answer"> 
      <span class="text">${answer}</span> 
      <span class="checkbox"> 
        <i class="fas fa-check"></i> 
      </span> 
    </div>
  `;
});

questionNumber.innerHTML = ` Question <span class="current">${questions.indexOf(question) + 1}</span> 
      <span class="total">/${questions.length}</span>`;

// Reset submit button and disable it until an answer is selected
submitBtn.disabled = true;

// Remove any previous selections
const answersDiv = document.querySelectorAll(".answer");
answersDiv.forEach((answer) => {
  answer.classList.remove("selected", "checked", "correct", "wrong");
  answer.addEventListener("click", () => {
    if (!answer.classList.contains("checked")) {
      answersDiv.forEach((answer) => {
        answer.classList.remove("selected");
      });
      answer.classList.add("selected");
      submitBtn.disabled = false;

      // Stop timer once an answer is selected
      clearInterval(timer);
      answered = true; // Mark as answered
    }
  });
});

startTimer(time);
};

const startTimer = (timeLimit) => {
let timeLeft = timeLimit;
progress(timeLeft); // Initialize progress bar
timer = setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
    progress(timeLeft);
  } else {
    clearInterval(timer);
    checkAnswer(); // Call checkAnswer when time is up
  }
}, 1000);
};

const loadingAnimation = () => {
startBtn.innerHTML = "Loading";
const loadingInterval = setInterval(() => {
  if (startBtn.innerHTML.length === 10) {
    startBtn.innerHTML = "Loading";
  } else {
    startBtn.innerHTML += ".";
  }
}, 500);
};

const submitBtn = document.querySelector(".submit"),
nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
checkAnswer();
});

const checkAnswer = () => {
const selectedAnswer = document.querySelector(".answer.selected");
if (selectedAnswer) {
  const answer = selectedAnswer.querySelector(".text").innerHTML;
  if (answer === questions[currentQuestion - 1].correct_answer) {
    score++;
    selectedAnswer.classList.add("correct");
  } else {
    selectedAnswer.classList.add("wrong");
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
        answer.classList.add("correct");
      }
    });
  }
} else {
  // Highlight correct answer if none was selected
  document.querySelectorAll(".answer").forEach((answer) => {
    if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
      answer.classList.add("correct");
    }
  });
}

const answersDiv = document.querySelectorAll(".answer");
answersDiv.forEach((answer) => {
  answer.classList.add("checked");
});

submitBtn.style.display = "none";

if (answered) {
  nextBtn.style.display = "block"; // Show next button if question was answered
} else {
  // Automatically move to the next question after a short delay if unanswered
  setTimeout(() => {
    nextQuestion();
  }, 2000);
}
};

nextBtn.addEventListener("click", () => {
nextQuestion();
});

const nextQuestion = () => {
if (currentQuestion < questions.length) {
  currentQuestion++;
  showQuestion(questions[currentQuestion - 1]);
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
} else {
  showScore();
}
};

const endScreen = document.querySelector(".end-screen"),
finalScore = document.querySelector(".final-score"),
totalScore = document.querySelector(".total-score");

const showScore = () => {
endScreen.classList.remove("hide");
quiz.classList.add("hide");
finalScore.innerHTML = score;
totalScore.innerHTML = `/ ${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
window.location.reload();
});


