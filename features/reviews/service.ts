import { TReview } from "@/entities/reviews";
import { db } from "@/lib/firebaseConfig";
import { storage } from "@/lib/firebaseStorageConfig";
import { reviewToEntity } from "@/mappers/reviewToEntity";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

export const createReview = async (
  review: any,
  userId: string,
  postId: string
): Promise<string | null> => {
  try {
    const reviewsRef = collection(db, "reviews");
    const imageUrls: string[] = [];

    for (const [index, uri] of review.images.entries()) {
      if (!uri || typeof uri !== "string") continue;

      const res = await fetch(uri);
      const blob = await res.blob();

      const imageRef = ref(storage, `reviews/${Date.now()}_${index}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      imageUrls.push(downloadURL);
    }

    const reviewToDB = {
      valoration: review.rating,
      textContent: review.opinion || "",
      images: imageUrls,
      created_at: Timestamp.now(),
      client_id: doc(db, "users", userId),
      post_id: doc(db, "posts", postId),
    };

    const newReview = await addDoc(reviewsRef, reviewToDB);
    return newReview.id;
  } catch (err) {
    console.error("🔥 Error al crear review:", err);
    return null;
  }
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) {
      console.warn("Review no encontrada");
      return false;
    }

    const data = reviewSnap.data();
    const imageUrls: string[] = data.images || [];

    // Eliminar cada imagen del storage
    await Promise.all(
      imageUrls.map(async (url) => {
        try {
          const pathStart = url.indexOf("/o/") + 3;
          const pathEnd = url.indexOf("?alt=");
          const filePath = decodeURIComponent(url.substring(pathStart, pathEnd));

          const imageRef = ref(storage, filePath);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn("No se pudo borrar una imagen:", err);
        }
      })
    );

    // Eliminar documento
    await deleteDoc(reviewRef);

    return true;
  } catch (error) {
    console.error("🔥 Error al eliminar review:", error);
    return false;
  }
};