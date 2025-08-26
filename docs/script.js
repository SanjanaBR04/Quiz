const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-page");
const quizContainer = document.getElementById("quiz-page");
const questionContainer = document.getElementById("question");
const optionsContainer = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-page");
const resultText = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from backend
async function loadQuestions() {
  try {
    console.log("Fetching questions from https://quiz-6-dlcr.onrender.com/api/quiz/questions...");
    const response = await fetch("https://quiz-6-dlcr.onrender.com/api/quiz/questions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${await response.text()}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }
    const data = await response.json();
    questions = Array.isArray(data) ? data : data.data || [];
    if (questions.length === 0) {
      throw new Error("No questions received from backend");
    }
    console.log("Questions loaded:", questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    questionContainer.textContent = `⚠️ Failed to load questions: ${error.message}. Please check the backend or try again later.`;
    const feedback = document.createElement("p");
    feedback.textContent = error.message;
    feedback.classList.add("feedback");
    questionContainer.appendChild(feedback);
    questions = [];
  }
}

// Reset options each time
function resetState() {
  nextBtn.classList.add("hidden"); // Use class instead of style
  optionsContainer.innerHTML = "";
  const feedback = questionContainer.querySelector(".feedback");
  if (feedback) feedback.remove();
}

// Show a question
function showQuestion() {
  resetState();

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    console.error("No question found at index:", currentQuestionIndex);
    questionContainer.textContent = "⚠️ No more questions available.";
    return;
  }

  questionContainer.textContent = currentQuestion.question;

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () =>
      selectAnswer(button, option, currentQuestion.answer)
    );
    optionsContainer.appendChild(button);
  });
}

// Select an answer
function selectAnswer(button, selected, correct) {
  const buttons = optionsContainer.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.classList.add("correct");
    }
    if (btn === button && selected !== correct) {
      btn.classList.add("wrong");
    }
  });

  // Add feedback message
  const feedback = document.createElement("p");
  feedback.classList.add("feedback");
  feedback.textContent = selected === correct ? "Correct!" : "Wrong!";
  feedback.style.color = selected === correct ? "#4CAF50" : "#f44336"; // Green for correct, red for wrong
  questionContainer.appendChild(feedback);

  if (selected === correct) {
    score++;
  }

  nextBtn.classList.remove("hidden"); // Use class instead of style
}

// Handle Next button
nextBtn.addEventListener("click", () => {
  console.log("Next clicked, currentQuestionIndex:", currentQuestionIndex, "Questions length:", questions.length);
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// Show final result
function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  resultText.textContent = `${score} out of ${questions.length}`;
}

// Handle Restart button
restartBtn.addEventListener("click", () => {
  console.log("Restart clicked");
  quizContainer.classList.add("hidden");
  resultContainer.classList.add("hidden");
  startScreen.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  questions = [];
  questionContainer.textContent = "";
  loadQuestions().then(() => {
    if (questions.length > 0) {
      quizContainer.classList.remove("hidden");
      showQuestion();
    }
  });
});

// Handle Start button
startBtn.addEventListener("click", async () => {
  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");

  console.log("Starting quiz, fetching questions...");
  await loadQuestions();

  currentQuestionIndex = 0;
  score = 0;

  if (questions && questions.length > 0) {
    showQuestion();
  } else {
    questionContainer.textContent = "⚠️ No questions available from the backend.";
  }
});
