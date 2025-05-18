import { TQuestion } from "@/entities/questions/entity";

export function questionToEntity(id: string, data: any): TQuestion {
  return {
    id,
    title: data.question,
    answer: data.answer,
  };
}
