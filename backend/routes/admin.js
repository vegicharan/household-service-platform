const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");


const { verifyWorker } = require("../models/Worker");

// Admin verifies worker
router.post("/verify-worker", async (req, res) => {
  try {
    const { workerId } = req.body;

    await verifyWorker(workerId);

    res.json({ message: "Worker verified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Release monthly support to eligible worker
router.post("/release-support", async (req, res) => {
  try {
    const { workerId, amount } = req.body;

    const workerRef = db.collection("workers").doc(workerId);
    const workerSnap = await workerRef.get();

    if (!workerSnap.exists) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const worker = workerSnap.data();

    if (!worker.eligibleForSupport) {
      return res
        .status(400)
        .json({ message: "Worker not eligible for support" });
    }

    await workerRef.update({
      supportReceived: amount,
      supportLastPaidAt: new Date(),
    });

    res.json({
      message: "Monthly support released successfully",
      amount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
