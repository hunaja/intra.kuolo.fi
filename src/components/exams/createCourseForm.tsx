"use client";

import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import type { CourseClassYear } from "@prisma/client";
import { Formik } from "formik";
import { formatClassName } from "@/utils";
import { api } from "@/trpc/react";

interface NewCourseForm {
  name: string;
  code: string;
  classYear: CourseClassYear;
}

export default function CreateCourseForm({
  initialClassYear,
  close,
}: {
  initialClassYear: CourseClassYear;
  close: () => void;
}) {
  const createCourse = api.course.createCourse.useMutation();
  const utils = api.useUtils();

  const onSubmit = async ({ name, code, classYear }: NewCourseForm) => {
    await createCourse.mutateAsync({
      classYear,
      code,
      name,
    });

    await utils.course.invalidate();

    close();
  };

  return (
    <Formik
      initialValues={{ name: "", code: "", classYear: initialClassYear }}
      onSubmit={onSubmit}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Select
              label="Vuosikurssi"
              className="mt-2"
              isRequired={true}
              isDisabled={isSubmitting}
              labelPlacement="outside"
              disallowEmptySelection={true}
              selectedKeys={new Set([values.classYear])}
              onSelectionChange={async (e) => {
                const courseId = Array.from(e)[0];
                await setFieldValue("classYear", courseId);
              }}
            >
              {(
                ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6"] as CourseClassYear[]
              ).map((courseYear) => (
                <SelectItem
                  key={courseYear}
                  textValue={formatClassName(courseYear)}
                >
                  {formatClassName(courseYear)}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Nimi"
              isRequired={true}
              placeholder="Esim. Hermosto"
              labelPlacement="outside"
              onChange={handleChange("name")}
              value={values.name}
              className="pt-2"
              isDisabled={isSubmitting}
            />
            <Input
              label="Koodi"
              className="pt-2"
              placeholder="Esim. HERMO"
              labelPlacement="outside"
              isDisabled={isSubmitting}
              value={values.code}
              onValueChange={handleChange("code")}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={close}>
              Sulje
            </Button>
            <Button color="primary" type="submit">
              Tallenna
            </Button>
          </ModalFooter>
        </form>
      )}
    </Formik>
  );
}
