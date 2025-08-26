require('dotenv').config();
const mongoose = require("mongoose");
const Question = require("./models/question");

mongoose.connect(process.env.MONGO_URI) // Match with index.js
    .then(async () => {
        console.log("Connected to MongoDB for seeding");
        await Question.deleteMany({});
        console.log("Deleted existing questions");
        await Question.insertMany([
            {
                question: "What is the capital of France?",
                options: ["Paris", "London", "Rome", "Berlin"],
                answer: "Paris"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Mars", "Venus", "Jupiter", "Saturn"],
                answer: "Mars"
            },
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                answer: "4"
            },
            {
                question: "Who wrote 'Hamlet'?",
                options: ["Shakespeare", "Dickens", "Tolstoy", "Homer"],
                answer: "Shakespeare"
            },
            {
                question: "Which is the largest mammal?",
                options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
                answer: "Blue Whale"
            }
        ]);
        console.log("Inserted questions:", result.length, "documents");
        console.log("✅ Sample questions inserted!");
    })
    .catch(err => console.error("❌ Seeding error:", err))
    .finally(() => mongoose.connection.close());
