import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";

import Stripe from "stripe";

if (!admin.apps.length) {
  admin.initializeApp();
}

// ✅ Stripe inicializado desde config()
const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2022-11-15",
});

// ✅ Función: sincronizar email al cambiar en Firestore
export const syncEmailChange = onDocumentUpdated("users/{userId}", async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();
  const userId = event.params.userId;

  if (!before || !after) return;
  if (before.email === after.email) return;

  try {
    await getAuth().updateUser(userId, { email: after.email });
    console.log(`✅ Email actualizado en Auth para ${userId}`);
  } catch (error) {
    console.error("❌ Error al actualizar el correo en Auth:", error);
  }
});

// ✅ Define interfaz para usar rawBody (ya lo maneja Firebase V2 internamente)
interface RawRequest extends Request {
  rawBody: Buffer;
}

// ✅ Función: guardar método de pago desde Stripe Webhook
export const savePaymentMethod = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (req: RawRequest, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ Webhook secret no está configurado.");
      res.status(500).send("Configuración faltante.");
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("❌ Error al verificar la firma del webhook:", err);
      res.status(400).send("Firma inválida");
      return;
    }

    if (event.type === "setup_intent.succeeded") {
      const setupIntent = event.data.object as Stripe.SetupIntent;
      const customerId = setupIntent.customer as string;
      const paymentMethodId = setupIntent.payment_method as string;

      try {
        const customersSnap = await admin
          .firestore()
          .collection("customers")
          .where("stripeId", "==", customerId)
          .limit(1)
          .get();

        if (customersSnap.empty) {
          console.warn("⚠️ Usuario con customerId no encontrado:", customerId);
          res.status(404).send("Usuario no encontrado");
          return;
        }

        const customerRef = customersSnap.docs[0].ref;

        await customerRef
          .collection("payment_methods")
          .doc(paymentMethodId)
          .set({
            id: paymentMethodId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        console.log(`✅ Método guardado: ${paymentMethodId} para ${customerId}`);
      } catch (error) {
        console.error("❌ Error guardando método de pago:", error);
        res.status(500).send("Error interno");
        return;
      }
    }

    res.status(200).send("OK");
  }
);
