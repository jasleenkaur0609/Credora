import { firebaseAuth } from "../config/firebase.js";

async function testFirebase() {
  try {
    await firebaseAuth.listUsers(1);
    console.log("Firebase Admin connection successful.");
  } catch (error) {
    console.error("Firebase Admin connection failed.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

testFirebase();