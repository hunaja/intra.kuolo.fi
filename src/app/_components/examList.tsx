"use client";

import { api } from "@/trpc/react";
import ExamBoxWithModtools from "./examBoxWithModtools";

export function ExamList() {
  const [exams] = api.exam.getAllInvisible.useSuspenseQuery();

  return (
    <div className="p-4 sm:p-10">
      <h1 className="text-3xl font-bold">Lähetetyt tentit</h1>
      <div className="mt-4">
        {exams?.map((exam) => (
          <ExamBoxWithModtools key={exam.id} exam={exam} />
        ))}

        {exams?.length === 0 && (
          <div className="text-gray-500">Ei käsittelemättömiä tenttejä.</div>
        )}
      </div>
    </div>
  );
}
