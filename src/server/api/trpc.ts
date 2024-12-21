/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import fetchSession from "@/fetchSession";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await fetchSession();

  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const enforceUserIsInauthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.session.type !== "inauthenticated") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be unauthenticated to access this resource",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.session.type === "inauthenticated") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated to access this resource",
    });
  }

  if (ctx.session.type === "inauthorized") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be authorized to access this resource",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const enforceUserIsMember = t.middleware(async ({ ctx, next }) => {
  if (ctx.session.type !== "member") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be a member to access this resource",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const enforceUserIsAdmin = t.middleware(async ({ ctx, next }) => {
  if (ctx.session.type !== "member" || !ctx.session.admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an admin to access this resource",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const publicProcedure = t.procedure;

export const inauthedProcedure = t.procedure.use(enforceUserIsInauthed);

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const memberProtectedProcedure = t.procedure.use(enforceUserIsMember);

export const adminProtectedProcedure = t.procedure.use(enforceUserIsAdmin);
