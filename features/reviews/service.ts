import { TReview } from "@/entities/reviews";
import { db } from "@/lib/firebaseConfig";
import { reviewToEntity } from "@/mappers/reviewToEntity";
import {
  collection,
  doc,
  DocumentSnapshot,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

const REVIEWS_PAGE_SIZE = 6;

export const getPaginatedReviewsByPostId = async (
  postId: string,
  lastVisible?: DocumentSnapshot
): Promise<{
  reviews: TReview[];
  last: DocumentSnapshot | null;
}> => {
  try {
    const reviewsRef = collection(db, "reviews");

    const constraints: any[] = [
      where("post_id", "==", doc(db, "posts", postId)),
      orderBy("valoration", "desc"),
      limit(REVIEWS_PAGE_SIZE),
    ];

    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    const q = query(reviewsRef, ...constraints);
    const snapshot = await getDocs(q);

    const reviews = await Promise.all(
      snapshot.docs.map((doc) => reviewToEntity(doc))
    );

    const last = snapshot.docs.at(-1) ?? null;

    return { reviews, last };
  } catch (error) {
    console.error("🔥 Error al paginar reviews:", error);
    return { reviews: [], last: null };
  }
};

export const getFeaturedReviewByPostId = async (
    postId: string,
): Promise<TReview | null> => {
    try {
        const q = query(
            collection(db, "reviews"),
            where("post_id", "==", doc(db, "posts", postId)),
            orderBy("valoration", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return await reviewToEntity(snapshot.docs[0]);
    } catch (error) {
        console.error("🔥 Error al obtener la reseña destacada:", error);
        return null;
    }
}

export const listenToReviewsByPostId = (
  postId: string,
  onUpdate: (reviews: TReview[]) => void
) => {
  const q = query(
    collection(db, "reviews"),
    where("post_id", "==", doc(db, "posts", postId)),
    orderBy("valoration", "desc")
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const reviews = await Promise.all(
      snapshot.docs.map((doc) => reviewToEntity(doc))
    );
    onUpdate(reviews);
  });

  return unsubscribe;
};
