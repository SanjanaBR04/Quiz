const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debug: list files in routes folder
const routesPath = path.join(__dirname, "routes");
console.log("📂 Files in routes folder:", fs.readdirSync(routesPath));

// ✅ Import quiz routes
const quizRoutes = require("./routes/quiz");
console.log("✅ quizRoutes loaded:", typeof quizRoutes);

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Quiz", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ DB connection error:", err));

// ✅ Default route
app.get("/", (req, res) => {
    res.send("Backend is running ✅. Try /api/quiz/questions");
});

// ✅ Mount quiz routes
app.use("/api/quiz", quizRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
