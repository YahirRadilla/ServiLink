import { TReview } from "@/entities/reviews";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { DocumentData, DocumentSnapshot, getDoc, Timestamp } from "firebase/firestore";
import { postToEntity, RawPostData } from "./postToEntity";

export const reviewToEntity = async (
  docSnap: DocumentSnapshot<DocumentData>
): Promise<TReview> => {
  const data = docSnap.data();
  if (!data || typeof data !== "object") {
    throw new Error("No data found in review document");
  }

  const clientSnap = await getDoc(data.client_id);
  const postSnap = await getDoc(data.post_id);

  const clientData = clientSnap.data() || {};
  const client = mapFirestoreUserToTUser({
    id: clientSnap.id,
    ...clientData,
  });

  const post = await postToEntity(postSnap.id, postSnap.data() as RawPostData);

  return {
    id: docSnap.id,
    client,
    postId: post,
    valoration: data.valoration,
    textContent: data.textContent || "",
    images: data.images || [],
    createdAt: data.created_at || Timestamp.now(),
  };
};
