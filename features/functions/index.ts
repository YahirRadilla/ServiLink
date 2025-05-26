import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";

initializeApp();

export const syncEmailChange = onDocumentUpdated("users/{userId}", async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    const userId = event.params.userId;

    if (!before || !after) return;

    const beforeEmail = before.email;
    const afterEmail = after.email;

    if (beforeEmail === afterEmail) return;

    try {
        await getAuth().updateUser(userId, { email: afterEmail });
        console.log(`✅ Email sincronizado en Auth para el user ${userId}: ${afterEmail}`);
    } catch (error) {
        console.error("❌ Error actualizando el correo en Auth:", error);
    }
});
