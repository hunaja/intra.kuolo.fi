import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { memberRouter } from "./routers/member";
import { examRouter } from "./routers/exam";
import { courseRouter } from "./routers/course";
import { guestRouter } from "./routers/guest";
import { ozgarsRouter } from "./routers/ozgars";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  member: memberRouter,
  exam: examRouter,
  course: courseRouter,
  guest: guestRouter,
  ozgars: ozgarsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
