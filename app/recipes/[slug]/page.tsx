
// optimize code detail
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/Button"
import { getCatalog } from "@/lib/catalog"

export default async function RecipeDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const catalog = await getCatalog()
  const recipe = catalog.recipes.find((r) => r.slug === params.slug)
  if (!recipe) notFound()

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-farm-800">
          <Link href="/recipes" className="hover:underline">
            Farm Recipes
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {recipe.title}
        </h1>
        <p className="mt-2 text-base text-zinc-700">
          {recipe.description}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <Image
            src={recipe.imagePath || "/photos/background.jpg"}
            alt={recipe.title}
            width={1400}
            height={1000}
            className="h-[360px] w-full object-cover sm:h-[440px]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader title="Ingredients" />
            <CardBody>
              <ul className="flex flex-col gap-2">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-farm-100 text-[10px] font-bold text-farm-700">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Instructions" />
            <CardBody>
              <ol className="flex flex-col gap-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm text-zinc-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white font-mono text-xs font-bold text-zinc-500 shadow-sm">
                      {i + 1}
                    </span>
                    <p className="mt-0.5 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <ButtonLink href="/recipes" variant="ghost">
          ← Back to recipes
        </ButtonLink>
      </div>
    </div>
  )
}
