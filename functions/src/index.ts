import * as admin from "firebase-admin";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
export * from "./notifications";

export const syncEmailChange = onDocumentUpdated("users/{userId}", async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  const userId = event.params.userId;

  if (!before || !after) return;

  const beforeEmail = before.email;
  const afterEmail = after.email;

  if (beforeEmail === afterEmail) return;

  try {
    await admin.auth().updateUser(userId, { email: afterEmail });
  } catch (error) {
    throw new Error(`Error updating email in Auth: ${error}`);
  }
});
