import { prisma } from "@/lib/prisma";
import { CategoryType } from "@prisma/client";

export interface CreateCategoryInput {
  userId: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export async function getCategories(userId: string, type?: CategoryType) {
  return await prisma.category.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
      archived: false,
    },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: CreateCategoryInput) {
  return await prisma.category.create({
    data: {
      userId: data.userId,
      name: data.name,
      type: data.type,
      color: data.color || "#10b981",
      icon: data.icon || "Folder",
    },
  });
}

export async function archiveCategory(id: string, userId: string) {
  return await prisma.category.update({
    where: { id, userId },
    data: { archived: true },
  });
}
