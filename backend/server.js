const express = require("express");
const cors = require("cors");
const workerRoutes = require("./routes/worker");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");



// Initialize Firebase (Admin SDK)
require("./config/firebase");

const authRoutes = require("./routes/auth");

// Import Firestore DB
const { db } = require("./config/firebase");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
console.log("workerRoutes:", typeof workerRoutes);
console.log("adminRoutes:", typeof adminRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);




// Base test route
app.get("/", (req, res) => {
  res.send("Household Service Platform API (Firebase) is running");
});

// 🔹 TEMPORARY Firestore test route
app.get("/test-db", async (req, res) => {
  try {
    await db.collection("test").add({
      status: "Firebase connected",
      time: new Date(),
    });
    res.send("Firestore working");
  } catch (error) {
    res.status(500).send("Firestore error: " + error.message);
  }
});

// Port
const PORT = process.env.PORT || 5000;


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
