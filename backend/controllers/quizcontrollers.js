const Question = require("../models/question");
const Score = require("../models/score");
const { shuffleArray } = require("../utils/shuffle");

// ✅ Get 5 random questions from MongoDB
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        if (questions.length === 0) {
            return res.status(404).json({ error: "No questions found in DB" });
        }

        const shuffled = shuffleArray(questions).slice(0, 5);

        res.json(
            shuffled.map(q => ({
                id: q._id,
                question: q.question,
                options: q.options,
                answer: q.answer   // ⚠️ remove this if you don’t want to send answer to frontend
            }))
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Save score to DB
exports.submitScore = async (req, res) => {
    const { username, score } = req.body;

    try {
        const newScore = new Score({ username, score });
        await newScore.save();
        res.json({ message: "✅ Score saved!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
