const express = require("express");
const router = express.Router();

// ✅ Import controllers
const quizController = require("../controllers/quizcontrollers");

// ✅ Debug logs
console.log("📌 quiz.js router loaded");

// ✅ Routes
router.get("/questions", quizController.getQuestions);
router.post("/submit", quizController.submitScore);

module.exports = router;
