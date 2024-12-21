"use client";

import { api } from "@/trpc/react";
import { DocumentTextIcon } from "@heroicons/react/16/solid";
import { Card, CardBody } from "@nextui-org/card";
import { Chip, Link } from "@nextui-org/react";
import type { Exam } from "@prisma/client";
import { useState } from "react";

export default function ExamBox({
  exam,
}: {
  exam: Pick<Exam, "id" | "year" | "name" | "fileSize" | "fileMimeType">;
}) {
  const [downloading, setDownloading] = useState(false);
  const getDownloadUrl = api.exam.getDownloadUrl.useMutation();

  const handleExamClick = async () => {
    setDownloading(true);

    const downloadUrl = await getDownloadUrl.mutateAsync({ examId: exam.id });
    window.open(downloadUrl, "_blank");

    setDownloading(false);
  };

  return (
    <Link
      key={exam.id}
      className="w-full hover:cursor-pointer disabled:hover:cursor-default"
      isDisabled={downloading}
      onPress={handleExamClick}
    >
      <Card className="w-full">
        <CardBody className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <DocumentTextIcon width={25} className="" />
            {exam.year ? (
              <>
                <p className="flex p-2">Vuosi {exam.year}</p>
                <Chip className="text-sm">{exam.name}</Chip>
              </>
            ) : (
              <p className="flex p-2">{exam.name}</p>
            )}
          </div>
          <div className="flex flex-row items-center text-sm">
            {exam.fileSize > 0 && (
              <p className="p-2">
                {Math.round(exam.fileSize / 1000 / 1000)} MB,{" "}
                {exam.fileMimeType}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
