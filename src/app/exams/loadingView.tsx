"use client";

import { AcademicCapIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Accordion, AccordionItem, Button, Skeleton } from "@nextui-org/react";
import type { Session } from "@/fetchSession";

export default function ExamsPageLoadingView({
  session,
}: {
  session: Pick<Session, "type">;
}) {
  return (
    <>
      <div className="flex flex-grow-0 justify-end px-2 sm:px-4">
        <Button
          isDisabled={true}
          color="primary"
          startContent={<AcademicCapIcon width={15} />}
        >
          <Skeleton className="rounded-lg">n. vsk</Skeleton>
        </Button>

        {session.type !== "guest" && (
          <Button
            color="primary"
            variant="bordered"
            isIconOnly
            className="ml-2"
            isDisabled={true}
          >
            <PlusCircleIcon width={15} />
          </Button>
        )}
      </div>

      <div className="flex-grow basis-0 overflow-hidden p-4 sm:p-10">
        <Accordion>
          <AccordionItem
            key={"1"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"2"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"3"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"4"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"5"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"6"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"7"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"8"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"9"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
          <AccordionItem
            key={"10"}
            title={
              <div>
                <Skeleton className="rounded-lg">VERHE</Skeleton>
              </div>
            }
            subtitle={<Skeleton className="rounded-lg">10 tenttiä</Skeleton>}
            isDisabled={true}
          >
            a
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
