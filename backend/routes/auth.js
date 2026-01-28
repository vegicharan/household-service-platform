const express = require("express");
const router = express.Router();

const { auth } = require("../config/firebase");
const { createUser, getUserByEmail } = require("../models/User");

/**
 * SIGNUP
 * role: user | worker | admin
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Store user profile in Firestore
    await createUser({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * LOGIN
 * (Firebase Auth handles password check on frontend later,
 * backend just verifies user exists)
 */
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
