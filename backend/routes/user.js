const express = require("express");
const router = express.Router();

const { getVerifiedWorkersBySkill } = require("../models/Worker");
const { createJob } = require("../models/Job");

/**
 * GET verified workers by service (skill)
 * Example: /api/users/workers/plumber
 */
router.get("/workers/:skill", async (req, res) => {
  try {
    const skill = req.params.skill;

    const workers = await getVerifiedWorkersBySkill(skill);

    res.json(workers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * CREATE JOB (User selects worker & service)
 */
router.post("/create-job", async (req, res) => {
  try {
    const { userId, serviceType, basePrice } = req.body;

    const jobId = await createJob({
      userId,
      serviceType,
      basePrice,
      finalPrice: basePrice,
    });

    res.status(201).json({
      message: "Job created successfully",
      jobId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User accepts worker and final price
router.post("/accept-offer", async (req, res) => {
  try {
    const { jobId, workerId, finalPrice } = req.body;

    const {
      assignWorkerToJob,
      updateJobPrice,
      updateJobStatus,
    } = require("../models/Job");

    await assignWorkerToJob(jobId, workerId);
    await updateJobPrice(jobId, finalPrice);
    await updateJobStatus(jobId, "in_progress");

    res.json({
      message: "Worker assigned and price locked",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User confirms job completion and gives rating
router.post("/rate-worker", async (req, res) => {
  try {
    const { jobId, workerId, rating } = req.body;

    const { getJobById, updateJobStatus } = require("../models/Job");
    const {
      updateWorkerRating,
      addWorkerEarnings,
      checkSupportEligibility,
    } = require("../models/Worker");

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const commissionPercent = 0.1; // 10%
    const platformCut = job.finalPrice * commissionPercent;
    const workerIncome = job.finalPrice - platformCut;

    // Update rating
    await updateWorkerRating(workerId, rating);

    // Update earnings & jobs
    await addWorkerEarnings(workerId, workerIncome);

    // Finalize job
    await updateJobStatus(jobId, "completed");

    // Check support eligibility
    const eligible = await checkSupportEligibility(workerId);

    res.json({
      message: "Job completed & income processed",
      workerIncome,
      platformCut,
      eligibleForSupport: eligible,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
