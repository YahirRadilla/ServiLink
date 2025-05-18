import { TQuestion } from "@/entities/questions/entity";
import { db } from "@/lib/firebaseConfig";
import { questionToEntity } from "@/mappers/questionToEntity";
import { collection, getDocs } from "firebase/firestore";

export const fetchAllQuestions = async (): Promise<TQuestion[]> => {
  try {
    const ref = collection(db, "faqs"); // o "questions" según tu colección
    const snapshot = await getDocs(ref);

    const questions: TQuestion[] = await Promise.all(
      snapshot.docs.map((doc) => questionToEntity(doc.id, doc.data()))
    );

    return questions;
  } catch (error) {
    console.error("❌ Error al obtener preguntas frecuentes:", error);
    return [];
  }
};
