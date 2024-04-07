import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getPaginatedCategories } from "~/utils/categories";

export const categoryRouter = createTRPCRouter({
    getCategories: protectedProcedure
        .meta(
            {
                hasAuth: true,
            }
        )
        .input(z.object(
            {
                page: z.number(),
                pageSize: z.number().optional().default(6),
                // passsword

            }))
        .query(async ({ ctx, input }) => {

            return getPaginatedCategories(ctx.db, ctx.userId!, input.page, input.pageSize)

        }),
    markCategoryChecked: protectedProcedure
        .input(z.object({
            categoryId: z.number(),
            checked: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {

            if (!input.checked) {
                const data = await ctx.db.categoriesChosenByUsers.create({
                    data: {
                        categoryId: input.categoryId,
                        userId: ctx.userId!
                    }
                })
                console.log('inpuit', data);
                return data;
            } else {
                const data = await ctx.db.categoriesChosenByUsers.delete({
                    where: {
                        userId_categoryId: {
                            userId: ctx.userId!,
                            categoryId: input.categoryId,
                        }
                    }
                })
                console.log('inpuit', data);
                return data;
            }
        })
});
