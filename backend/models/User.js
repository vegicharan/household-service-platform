const { db } = require("../config/firebase");

// Collection name
const USER_COLLECTION = "users";

// Create user
const createUser = async (userData) => {
  const userRef = await db.collection(USER_COLLECTION).add(userData);
  return userRef.id;
};

// Get user by ID
const getUserById = async (id) => {
  const doc = await db.collection(USER_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Get user by email
const getUserByEmail = async (email) => {
  const snapshot = await db
    .collection(USER_COLLECTION)
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
