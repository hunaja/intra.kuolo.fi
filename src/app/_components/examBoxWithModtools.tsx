import type { Course, Exam, Member } from "@prisma/client";
import { formatClassName, initials } from "../utils";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Button, User } from "@nextui-org/react";
import ExamBox from "./examBox";
import { CheckIcon, TrashIcon } from "@heroicons/react/16/solid";

export default function ExamBoxWithModtools({
  exam,
}: {
  exam: Pick<Exam, "id" | "year" | "name" | "fileSize" | "fileMimeType"> & {
    course: Pick<Course, "classYear" | "name">;
    submitter: Pick<Member, "fullName"> | null;
  };
}) {
  const [disabled, setDisabled] = useState(false);
  const deleteExam = api.exam.deleteExam.useMutation();
  const approveExam = api.exam.approveExam.useMutation();
  const utils = api.useUtils();

  const handleApprove = async () => {
    setDisabled(true);

    await approveExam.mutateAsync(exam.id);
    await utils.exam.invalidate();

    setDisabled(false);
  };

  const handleDelete = async () => {
    setDisabled(true);

    await deleteExam.mutateAsync(exam.id);
    await utils.exam.invalidate();

    setDisabled(false);
  };

  return (
    <div className="p-2" key={exam.id}>
      <User
        description={
          <p>
            lähetti tentin kurssille{" "}
            <strong className="font-bold">{exam.course.name}</strong>
            {` ${formatClassName(exam.course.classYear)}`}
          </p>
        }
        avatarProps={{
          name: exam.submitter ? initials(exam.submitter.fullName) : undefined,
        }}
        name={exam.submitter?.fullName ?? "Tuntematon"}
      />
      <div className="my-2 mb-5 flex flex-col place-items-center sm:flex-row">
        <ExamBox key={exam.id} exam={exam} />
        <Button
          isIconOnly
          variant="bordered"
          className="ml-5"
          isDisabled={disabled}
          onPress={handleDelete}
        >
          <TrashIcon width={15} />
        </Button>
        <Button
          isIconOnly
          variant="bordered"
          color="primary"
          className="ml-5"
          isDisabled={disabled}
          onPress={handleApprove}
        >
          <CheckIcon width={15} />
        </Button>
      </div>
    </div>
  );
}
