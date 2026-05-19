
// task project adjust
import { z } from "zod"

export const CategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  sortOrder: z.number().int().nonnegative().default(0)
})

export const ProductSchema = z.object({
  id: z.string().min(1),
  categorySlug: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional().default(null),
  imagePath: z.string().nullable().optional().default(null),
  imagePaths: z.array(z.string()).optional().default([]),
  priceHint: z.string().nullable().optional().default(null),
  externalUrl: z.string().url().nullable().optional().default(null),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().nullable().optional().default(null)
})

export const JournalPostSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().nullable().optional().default(null),
  body: z.string().min(1),
  publishedAt: z.string().datetime().nullable().optional().default(null)
})

export const FarmRegionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional().default(null),
  imagePath: z.string().nullable().optional().default(null),
  ctaLabel: z.string().nullable().optional().default(null),
  ctaHref: z.string().nullable().optional().default(null),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100)
})

export const RecipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional().default(null),
  ingredients: z.array(z.string()).default([]),
  instructions: z.array(z.string()).default([]),
  imagePath: z.string().nullable().optional().default(null)
})

export const CatalogSchema = z.object({
  categories: z.array(CategorySchema),
  products: z.array(ProductSchema),
  journalPosts: z.array(JournalPostSchema).default([]),
  recipes: z.array(RecipeSchema).default([]),
  farmRegions: z.array(FarmRegionSchema).default([])
})

export type Catalog = z.infer<typeof CatalogSchema>
export type CatalogCategory = z.infer<typeof CategorySchema>
export type CatalogProduct = z.infer<typeof ProductSchema>
export type CatalogJournalPost = z.infer<typeof JournalPostSchema>
export type CatalogFarmRegion = z.infer<typeof FarmRegionSchema>
export type CatalogRecipe = z.infer<typeof RecipeSchema>

