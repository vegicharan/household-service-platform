const { db } = require("../config/firebase");
const admin = require("firebase-admin");

// Collection name
const WORKER_COLLECTION = "workers";

// Create worker
const createWorker = async (workerData) => {
  const workerRef = await db.collection(WORKER_COLLECTION).add({
    ...workerData,
    verified: false,
    rating: 0,
    totalJobs: 0,
    totalEarnings: 0,
    eligibleForSupport: false,
    createdAt: new Date(),
  });
  return workerRef.id;
};

// Get worker by ID
const getWorkerById = async (id) => {
  const doc = await db.collection(WORKER_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Get all verified workers by skill
const getVerifiedWorkersBySkill = async (skill) => {
  const snapshot = await db
    .collection(WORKER_COLLECTION)
    .where("skill", "==", skill)
    .where("verified", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update worker rating
const updateWorkerRating = async (workerId, newRating) => {
  const workerRef = db.collection(WORKER_COLLECTION).doc(workerId);
  await workerRef.update({
    rating: newRating,
  });
};

// Update worker earnings
const updateWorkerEarnings = async (workerId, amount) => {
  const workerRef = db.collection(WORKER_COLLECTION).doc(workerId);
  await workerRef.update({
    totalEarnings: amount,
  });
};

// Verify worker (Admin)
const verifyWorker = async (workerId) => {
  await db.collection(WORKER_COLLECTION).doc(workerId).update({
    verified: true,
  });
};
// Increment worker earnings & job count
const addWorkerEarnings = async (workerId, amount) => {
  const workerRef = db.collection(WORKER_COLLECTION).doc(workerId);

  await workerRef.update({
    totalEarnings: admin.firestore.FieldValue.increment(amount),
    totalJobs: admin.firestore.FieldValue.increment(1),
  });
};

// Check eligibility for monthly support
const checkSupportEligibility = async (workerId) => {
  const workerRef = db.collection(WORKER_COLLECTION).doc(workerId);
  const workerSnap = await workerRef.get();

  if (!workerSnap.exists) return false;

  const worker = workerSnap.data();

  // Basic eligibility rules (can be adjusted)
  if (worker.totalJobs >= 5 && worker.rating >= 3.5) {
    await workerRef.update({ eligibleForSupport: true });
    return true;
  } else {
    await workerRef.update({ eligibleForSupport: false });
    return false;
  }
};

module.exports = {
  createWorker,
  getWorkerById,
  getVerifiedWorkersBySkill,
  updateWorkerRating,
  updateWorkerEarnings,
  verifyWorker,
  addWorkerEarnings,
  checkSupportEligibility,
};



