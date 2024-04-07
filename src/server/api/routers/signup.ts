import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hashPassword } from "~/utils/password";

export const signupRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object(
      {
        username: z.string().min(4, { message: "username must be at least 4 characters long." }),
        email: z.string().email({ message: "invalid email id." }),
        password: z.string().min(8, { message: "password must be at least 8 characters long." }),
        // passsword

      }))
    .mutation(async ({ ctx, input }) => {

      const emailTaken = await ctx.db.user.findUnique({
        where: {
          email: input.email
        }
      });
      if (emailTaken)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'email:email is already taken',

        })
      return await ctx.db.user.create({
        data: {
          name: input.username,
          email: input.email,
          password: await hashPassword(input.password)
        }
      });

    })
});
