import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { memberRouter } from "./routers/member";
import { examRouter } from "./routers/exam";
import { courseRouter } from "./routers/course";
import { guestRouter } from "./routers/guest";
import { ozgarsRouter } from "./routers/ozgars";

export const appRouter = createTRPCRouter({
  member: memberRouter,
  exam: examRouter,
  course: courseRouter,
  guest: guestRouter,
  ozgars: ozgarsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
