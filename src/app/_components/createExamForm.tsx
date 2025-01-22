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

    setSubmitState("idle");

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
          name: z.string().nonempty("Kuvaus on annettava."),
          year: z.string().optional(),
          courseId: z.string({
            required_error: "Kurssi on annettava.",
          }),
          file: z.object(
            {
              name: z.string(),
              // Max file size is 100 MB
              size: z.number().max(100 * 1024 * 1024),
            },
            {
              invalid_type_error: "Tenttimateriaali on annettava.",
              required_error: "Tenttimateriaali on annettava.",
            },
          ),
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
              labelPlacement="outside"
              isRequired={true}
              value={formatClassName(classYear)}
              isDisabled={true}
            />
            <Select
              label="Kurssi"
              className="pt-2"
              isRequired={true}
              placeholder={`Esim. ${courses[0]?.name}`}
              labelPlacement="outside"
              selectionMode="single"
              disallowEmptySelection={true}
              selectedKeys={
                values.courseId ? new Set([values.courseId]) : new Set([])
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
              errorMessage={errors.courseId}
              isInvalid={!!errors.courseId}
            >
              {courses.map((course) => (
                <SelectItem key={course.id} textValue={course.name}>
                  {course.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Kuvaus"
              placeholder="Esim. lopputentti tai preppi"
              className="pt-2"
              labelPlacement="outside"
              value={values.name}
              onValueChange={handleChange("name")}
              onBlur={handleBlur("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              isRequired={true}
              isDisabled={isSubmitting}
            />
            <Input
              label="Vuosi"
              placeholder="Jätä tyhjäksi jos yleinen materiaali, esim. tenttipreppi"
              type="number"
              labelPlacement="outside"
              className="pt-2"
              value={values.year}
              onValueChange={handleChange("year")}
              onBlur={handleBlur("year")}
              isDisabled={isSubmitting}
              isInvalid={!!errors.year}
              errorMessage={errors.year}
            />

            <p className={`pt-2 text-sm ${errors.file ? "text-danger" : ""}`}>
              Tenttimateriaali<span className="ml-1 text-danger">*</span>
            </p>
            <Button
              as="label"
              htmlFor="file"
              variant="bordered"
              color={errors.file ? "danger" : undefined}
              className="text-sm"
              onBlur={handleBlur("file")}
              isDisabled={isSubmitting}
            >
              <div className="flex w-full flex-row justify-between">
                <div className="mr-2 text-gray-500">Valitse...</div>
                <div>{values.file ? values.file.name : ""}</div>
              </div>
            </Button>
            <input
              type="file"
              id="file"
              onChange={(e) => setFieldValue("file", e.target?.files?.[0])}
              className="hidden"
            />
            {errors.file && (
              <div className="text-sm text-danger">{errors.file}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={close}>
              Sulje
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={submitState !== "idle"}
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
