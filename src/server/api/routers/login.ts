import { z } from "zod";
import { encryptSession, createSession } from "~/utils/session";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hashPassword, verifyPassword } from "~/utils/password";
import { TRPCError } from "@trpc/server";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
export const loginRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object(
      {
        email: z.string().email({ message: "invalid email id." }),
        password: z.string().min(8, { message: "password is too short to be valid." }),

      }))
    .mutation(async ({ ctx, input, }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        }
      })


      if (!user)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'email:email or password not correct',
        })

      if (! await verifyPassword(input.password, user.password))
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'email:email or password not correct',
        })


      const session = await createSession(ctx.db, user.id);
      const encryptedSession = `${session.userId}:${session.sessionToken}`;
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + SESSION_DURATION);
      const cookieExpires = expirationDate.toUTCString();
      ctx.res.setHeader('Set-Cookie', `session=${encryptedSession}; Path=/; Expires=${cookieExpires}; HttpOnly`);

      return {
        message: 'logged_in'
      }


    })
});
