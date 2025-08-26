require('dotenv').config();
const mongoose = require("mongoose");
const Question = require("./models/question");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for checking");
    const questions = await Question.find();
    console.log("Raw query result:", questions);
    if (questions.length === 0) {
      console.log("No questions found in the 'questions' collection!");
    } else {
      console.log("Questions found:", questions.length);
      console.log("Details:", questions);
    }
    mongoose.connection.close();
  })
  .catch(err => console.error("Error connecting or querying:", err));
