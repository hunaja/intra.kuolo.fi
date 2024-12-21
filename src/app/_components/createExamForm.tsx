"use client";

import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import type { Course, CourseClassYear } from "@prisma/client";
import { Formik } from "formik";
import { formatClassName } from "../utils";
import { api } from "@/trpc/react";
import { withZodSchema } from "formik-validator-zod";
import { z } from "zod";
import { useState } from "react";

interface NewExamForm {
  name: string;
  year: string;
  courseId: string | null;
  file: File | null;
}

export default function CreateExamForm({
  courses,
  classYear,
  close,
}: {
  courses: Pick<Course, "id" | "name">[];
  classYear: CourseClassYear;
  close: () => void;
}) {
  const [submitState, setSubmitState] = useState<
    "idle" | "submittingExam" | "submittingFile"
  >("idle");
  const submitExam = api.exam.submitExam.useMutation();
  const utils = api.useUtils();

  const onSubmit = async ({ courseId, name, year, file }: NewExamForm) => {
    if (!file || !courseId) return null;

    setSubmitState("submittingExam");

    const uploadUrl = await submitExam.mutateAsync({
      courseId,
      name,
      year: year ? parseInt(year) : null,
      file: {
        name: file.name,
        size: file.size,
      },
    });

    setSubmitState("submittingFile");

    const fileResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!fileResponse.ok) {
      throw new Error("Failed to upload file");
    }

    await utils.course.invalidate();

    close();
  };

  return (
    <Formik
      initialValues={
        {
          courseId: courses[0]?.id ?? null,
          name: "",
          year: "",
          file: null,
        } as NewExamForm
      }
      onSubmit={onSubmit}
      // @ts-expect-error to be fixed
      validate={withZodSchema(
        z.object({
          name: z.string().nonempty("Nimen on oltava vähintään yksi merkki."),
          year: z.string(),
          courseId: z.string(),
          file: z.object({
            name: z.string(),
            size: z.number(),
          }),
        }),
      )}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        setFieldValue,
        isSubmitting,
        errors,
      }) => (
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Input
              label="Vuosikurssi"
              isRequired={true}
              value={formatClassName(classYear)}
              isDisabled={true}
            />
            <Select
              label="Kurssi"
              className="mt-2"
              isRequired={true}
              selectionMode="single"
              selectedKeys={
                values.courseId ? new Set([values.courseId]) : undefined
              }
              disabledKeys={
                isSubmitting ? new Set(courses.map((c) => c.id)) : undefined
              }
              onSelectionChange={async (e) => {
                const courseId = Array.from(e)[0];
                await setFieldValue("courseId", courseId);
              }}
              value={values.courseId ?? undefined}
              description="Ota yhteyttä itvastaava@kuolo.fi, jos et löydä kurssia valikosta."
              onBlur={handleBlur("courseId")}
            >
              {courses.map((course) => (
                <SelectItem key={course.id} textValue={course.name}>
                  {course.name}
                </SelectItem>
              ))}
            </Select>
            {errors.courseId && (
              <div className="text-sm text-danger">
                Vuosikurssi: {errors.courseId}
              </div>
            )}
            <Input
              label="Kuvaus"
              placeholder="Esim. lopputentti tai preppi"
              isRequired={true}
              className="mt-2"
              value={values.name}
              onValueChange={handleChange("name")}
              onBlur={handleBlur("name")}
              isDisabled={isSubmitting}
            />
            {errors.year && (
              <div className="text-sm text-danger">Kuvaus: {errors.name}</div>
            )}
            <Input
              label="Vuosi"
              placeholder="Jätä tyhjäksi jos yleinen materiaali, esim. tenttipreppi"
              type="number"
              className="mt-2"
              value={values.year}
              onValueChange={handleChange("year")}
              onBlur={handleBlur("year")}
              isDisabled={isSubmitting}
            />
            {errors.year && (
              <div className="text-sm text-danger">Vuosi: {errors.year}</div>
            )}

            <Button
              as="label"
              htmlFor="file"
              variant="bordered"
              className="mt-2 text-sm"
              onBlur={handleBlur("file")}
              isDisabled={isSubmitting}
            >
              <div className="flex w-full flex-row justify-between">
                <div className="mr-2 text-gray-500">
                  Valitse tenttimateriaali
                </div>
                <div>{values.file ? values.file.name : "Ei valittu"}</div>
              </div>
            </Button>
            <input
              type="file"
              id="file"
              onChange={(e) => setFieldValue("file", e.target?.files?.[0])}
              className="hidden"
            />
            {errors.file && (
              <div className="text-sm text-danger">Tiedosto: {errors.file}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={close}>
              Sulje
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={
                submitState === "submittingExam" ||
                submitState === "submittingFile"
              }
              isDisabled={isSubmitting}
            >
              {submitState === "submittingExam" && "Lähetään..."}
              {submitState === "submittingFile" && "Lähetetään tiedostoa"}
              {submitState === "idle" && "Lähetä"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </Formik>
  );
}
