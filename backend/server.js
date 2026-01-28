const express = require("express");
require("./config/firebase");

const authRoutes = require("./routes/auth");
const workerRoutes = require("./routes/worker");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const { db } = require("./config/firebase");

const app = express();

// =====================
// BODY PARSERS
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// MANUAL CORS (FIXES RENDER ISSUE)
// =====================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
app.get("/", (req, res) => {
  res.send("Household Service Platform API (Firebase) is running");
});

app.get("/test-db", async (req, res) => {
  await db.collection("test").add({ status: "ok" });
  res.send("Firestore working");
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
