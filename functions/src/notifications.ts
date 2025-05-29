import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2/firestore";
admin.initializeApp();

export const onProposalAccepted = functions.onDocumentUpdated("proposals/{proposalId}", async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  if (!before || !after) return;

  // Solo si el estado cambió a "accepted"
  if (before.accept_status !== "accepted" && after.accept_status === "accepted") {
    const clientId = after.client_id?.id;
    const providerId = after.provider_id?.id;
    const acceptedBy = after.accepted_by; // Asume que tienes este campo en tu documento

    if (!clientId || !providerId || !acceptedBy) return;

    // Determina a quién notificar
    let recipientId: string;
    let message: string;
    let userType: string;

    if (acceptedBy === clientId) {
      // Cliente aceptó → notificar al proveedor
      recipientId = providerId;
      message = "Tu propuesta fue aceptada por el cliente.";
      userType = "provider";
    } else if (acceptedBy === providerId) {
      // Proveedor aceptó → notificar al cliente
      recipientId = clientId;
      message = "Tu propuesta fue aceptada por el proveedor.";
      userType = "client";
    } else {
      return;
    }

    await admin.firestore().collection("notifications").add({
      user_id: admin.firestore().doc(`users/${recipientId}`),
      content: message,
      title: "Propuesta aceptada",
      type: "proposal",
      type_user: userType,
      seen: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
});



export const onProposalCreated = functions.onDocumentCreated("proposals/{proposalId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const providerRef = data.provider_id;
  if (!providerRef?.id) return;

  await admin.firestore().collection("notifications").add({
    user_id: admin.firestore().doc(`users/${providerRef.id}`),
    content: "Has recibido una nueva propuesta.",
    title: "Nueva propuesta",
    type: "proposal",
    type_user: "provider",
    seen: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
});


export const onContractCreated = functions.onDocumentCreated("contracts/{contractId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const [clientId, providerId] = [data.client_id?.id, data.provider_id?.id];
  if (!clientId || !providerId) return;

  const batch = admin.firestore().batch();
  const ref = admin.firestore().collection("notifications");

  batch.set(ref.doc(), {
    user_id: admin.firestore().doc(`users/${clientId}`),
    content: "Se ha generado un contrato con tu proveedor.",
    title: "Contrato creado",
    type: "contract",
    type_user: "client",
    seen: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.set(ref.doc(), {
    user_id: admin.firestore().doc(`users/${providerId}`),
    content: "Tienes un nuevo contrato con un cliente.",
    title: "Contrato generado",
    type: "contract",
    type_user: "provider",
    seen: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
});


export const onReviewCreated = functions.onDocumentCreated("reviews/{reviewId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const providerRef = data.postId?.provider;
  if (!providerRef?.id) return;

  await admin.firestore().collection("notifications").add({
    user_id: admin.firestore().doc(`users/${providerRef.id}`),
    content: "Has recibido una nueva reseña.",
    title: "Nueva reseña",
    type: "review",
    type_user: "provider",
    seen: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
});

export const onMessageReceived = functions.onDocumentCreated("messages/{messageId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const receiverId = data.receiver_id;
  if (!receiverId) return;

  await admin.firestore().collection("notifications").add({
    user_id: admin.firestore().doc(`users/${receiverId}`),
    content: "Tienes un nuevo mensaje.",
    title: "Nuevo mensaje",
    type: "message",
    type_user: "both",
    seen: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
});
