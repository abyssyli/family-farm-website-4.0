
# minor content update
import Link from "next/link"
import Image from "next/image"
import { Card, CardBody } from "@/components/ui/Card"
import { getCatalog } from "@/lib/catalog"

export default async function RecipesPage() {
  const catalog = await getCatalog()
  const recipes = catalog.recipes

  return (
    <div className="flex flex-col gap-10 pb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Farm Recipes
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          Delicious ways to enjoy our farm-fresh ingredients at home.
        </p>
      </div>

      {recipes.length === 0 ? (
        <p className="text-sm text-zinc-500 italic">Coming soon! We're gathering our favorite family recipes.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={recipe.imagePath || "/photos/background.jpg"}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardBody>
                  <h3 className="text-lg font-semibold group-hover:text-farm-700">
                    {recipe.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {recipe.description}
                  </p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-farm-700">
                    View Recipe →
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
