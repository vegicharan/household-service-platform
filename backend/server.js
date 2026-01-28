// =====================
// IMPORTS
// =====================
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
require("./config/firebase");

// Route imports
const authRoutes = require("./routes/auth");
const workerRoutes = require("./routes/worker");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

// Firestore DB (optional test usage)
const { db } = require("./config/firebase");

// =====================
// APP INIT
// =====================
const app = express();

// =====================
// MIDDLEWARE (CORRECT ORDER)
// =====================

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Proper CORS configuration (IMPORTANT)
app.use(
  cors({
    origin: "*", // allow all origins (OK for college/demo project)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests (THIS FIXES YOUR ERROR)
app.options("*", cors());

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// =====================
// TEST ROUTES
// =====================

// Health check
app.get("/", (req, res) => {
  res.send("Household Service Platform API (Firebase) is running");
});

// Firestore test (optional)
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

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
