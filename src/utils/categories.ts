

import { type PrismaClient } from '@prisma/client';

export async function getPaginatedCategories(db: PrismaClient, userId: string, page = 1, pageSize = 6) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const categories: { id: number, name: string, checked: boolean }[] = await db.$queryRaw`
        SELECT 
        "public"."Category"."id","public"."Category"."name",
        CASE
        WHEN "public"."CategoriesChosenByUsers"."categoryId" IS NOT NULL THEN TRUE
        ELSE FALSE
        END as checked
        FROM "public"."Category"
        LEFT JOIN "public"."CategoriesChosenByUsers" 
        ON "public"."CategoriesChosenByUsers"."categoryId" = "public"."Category".id AND 
        "public"."CategoriesChosenByUsers"."userId" = ${userId}
        ORDER BY checked DESC, "public"."CategoriesChosenByUsers"."assignedAt" DESC NULLS LAST, 
        "public"."Category"."createdAt" DESC 
        LIMIT ${take} OFFSET ${skip}`;

    return categories;
};
