"use client";

import { api } from "@/trpc/react";
import QuestionForm from "./question-form";
import type { SubmitHandler } from "react-hook-form";
import type { QuestionFormData } from "@/server/api/routers/question/question-validators";

type NewQuestionProps = {
  collectionId: number;
};
export default function NewQuestion({ collectionId }: NewQuestionProps) {
  const { mutateAsync } = api.question.create.useMutation();
  const onSubmit: SubmitHandler<QuestionFormData> = async (values) => {
    await mutateAsync(values);
  };

  return (
    <div className="">
      <QuestionForm collectionId={collectionId} onSubmit={onSubmit} />
    </div>
  );
}
