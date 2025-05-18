import { useQuestionStore } from "@/entities/questions/store";
import { useEffect, useState } from "react";
import { fetchAllQuestions } from "./service";

export const useQuestions = () => {
  const { setQuestions, clearQuestions } = useQuestionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const faqs = await fetchAllQuestions();
        setQuestions(faqs);
      } catch (error) {
        console.error("❌ Error al cargar preguntas:", error);
        setQuestions([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();

    return () => {
      clearQuestions(); // Limpia al desmontar
    };
  }, []);

  return { loading };
};
