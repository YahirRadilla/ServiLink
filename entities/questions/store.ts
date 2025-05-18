import { create } from "zustand";
import { TQuestion } from "./entity";

type QuestionState = {
  questions: TQuestion[];
  setQuestions: (questions: TQuestion[]) => void;
  clearQuestions: () => void;
};

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  setQuestions: (questions) => set({ questions }),
  clearQuestions: () => set({ questions: [] }),
}));
