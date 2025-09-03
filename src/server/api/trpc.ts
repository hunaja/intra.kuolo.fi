import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import fetchSession from "@/fetchSession";
import { Permission } from "@prisma/client";

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

const enforceUserIsNotAdvertiser = t.middleware(async ({ ctx, next }) => {
  if (ctx.session.type === "guest" && ctx.session.advertiser) {
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

const isPermission = (permission: unknown): permission is Permission => {
  return (
    typeof permission === "string" &&
    Object.values(Permission).includes(permission as Permission)
  );
};

const enforceUserHasPermission = t.middleware(async ({ ctx, next, meta }) => {
  if (ctx.session.type !== "member") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be a member to access this resource",
    });
  }

  if (
    (!meta ||
      !("requiredPermission" in meta) ||
      !isPermission(meta.requiredPermission) ||
      !ctx.session.permissions.includes(meta.requiredPermission)) &&
    !ctx.session.admin
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
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

export const permissionProtectedProcedure = t.procedure
  .use(enforceUserIsMember)
  .use(enforceUserHasPermission);

export const notAdvertiserProcedure = t.procedure.use(
  enforceUserIsNotAdvertiser,
);
