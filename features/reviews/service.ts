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

const REVIEWS_PAGE_SIZE = 3;

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

export const getAverageReviewRating = async (postId: string): Promise<number> => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("post_id", "==", doc(db, "posts", postId)));
    const snapshot = await getDocs(q);

    const reviews = snapshot.docs.map(doc => doc.data());
    const total = reviews.length;

    if (total === 0) return 0;

    const sum = reviews.reduce((acc, review) => acc + review.valoration, 0);
    return sum / total;
  } catch (error) {
    console.error("Error al calcular promedio de valoraciones:", error);
    return 0;
  }
};


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

export const getTotalReviewsCountByPostId = async (postId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("post_id", "==", doc(db, "posts", postId))
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("🔥 Error al obtener el conteo de reseñas:", error);
    return 0;
  }
};