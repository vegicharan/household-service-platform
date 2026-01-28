const { db } = require("../config/firebase");

// Collection name
const JOB_COLLECTION = "jobs";

// Create a new job
const createJob = async (jobData) => {
  const jobRef = await db.collection(JOB_COLLECTION).add({
    ...jobData,
    status: "requested", // requested | accepted | in_progress | completed
    createdAt: new Date(),
  });
  return jobRef.id;
};

// Get job by ID
const getJobById = async (jobId) => {
  const doc = await db.collection(JOB_COLLECTION).doc(jobId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Get jobs for a worker
const getJobsByWorker = async (workerId) => {
  const snapshot = await db
    .collection(JOB_COLLECTION)
    .where("workerId", "==", workerId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update job price (negotiation)
const updateJobPrice = async (jobId, finalPrice) => {
  await db.collection(JOB_COLLECTION).doc(jobId).update({
    finalPrice,
  });
};

// Update job status
const updateJobStatus = async (jobId, status) => {
  await db.collection(JOB_COLLECTION).doc(jobId).update({
    status,
  });
};

// Assign worker to job
const assignWorkerToJob = async (jobId, workerId) => {
  await db.collection(JOB_COLLECTION).doc(jobId).update({
    workerId,
    status: "accepted",
  });
};

// Worker proposes a price
const proposePrice = async (jobId, workerId, proposedPrice) => {
  await db.collection(JOB_COLLECTION).doc(jobId).update({
    proposedBy: workerId,
    proposedPrice,
  });
};


module.exports = {
  createJob,
  getJobById,
  getJobsByWorker,
  updateJobPrice,
  updateJobStatus,
  assignWorkerToJob,
  proposePrice,   // 👈 add this
};

