const express = require("express");
const router = express.Router();

const { createWorker, getWorkerById } = require("../models/Worker");

// Worker registers profile
router.post("/register", async (req, res) => {
  try {
    const { name, skill, experience, userId } = req.body;

    const workerId = await createWorker({
      name,
      skill,
      experience,
      userId,
    });

    res.status(201).json({
      message: "Worker registration submitted",
      workerId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get worker profile
router.get("/:id", async (req, res) => {
  try {
    const worker = await getWorkerById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Worker proposes a new price for a job
router.post("/propose-price", async (req, res) => {
  try {
    const { jobId, workerId, proposedPrice } = req.body;

    const { proposePrice } = require("../models/Job");

    await proposePrice(jobId, workerId, proposedPrice);

    res.json({
      message: "Price proposal sent to user",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Worker marks job as completed
router.post("/complete-job", async (req, res) => {
  try {
    const { jobId } = req.body;

    const { updateJobStatus } = require("../models/Job");

    await updateJobStatus(jobId, "completed");

    res.json({
      message: "Job marked as completed by worker",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
