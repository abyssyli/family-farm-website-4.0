
/* minor adjust */
import Link from "next/link"
import Image from "next/image"
import { StoryHero } from "@/components/farm/StoryHero"
import { FarmMap } from "@/components/farm/FarmMap"
import { Card } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/Button"
import { WorldUserMap } from "@/components/ui/WorldUserMap"
import { getCatalog } from "@/lib/catalog"
import { getPublicEnv } from "@/lib/env"

export default async function HomePage() {
  const catalog = await getCatalog()
  const categories = catalog.categories
  const regions = catalog.farmRegions
  const { skincareUrl } = getPublicEnv()
  const activeProducts = catalog.products.filter((p) => p.isActive !== false)
  const eggsThisWeek = activeProducts.filter((p) => p.categorySlug === "eggs").slice(0, 4)
  const foodThisWeek = activeProducts.filter((p) => p.categorySlug === "food").slice(0, 4)
  const woodcraftThisWeek = activeProducts
    .filter((p) => p.categorySlug === "woodcraft")
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-14">
      <StoryHero />
      <FarmMap regions={regions} />

      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Updates</h2>
            <p className="mt-2 text-sm text-zinc-700">
              The latest notes from the farm and Hands&apos; Village.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="h-full overflow-hidden">
            <div className="relative h-44 w-full">
              <Image
                src="/photos/farm1.jpg"
                alt="What's new this week on the farm"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-base font-semibold">
                What&apos;s new this week on the farm
              </h3>
              <p className="mt-2 text-sm text-zinc-700">
                Summer is coming! The chickens enjoy iced watermelon.
              </p>
            </div>
          </Card>

          <Card className="h-full overflow-hidden">
            <div className="relative h-44 w-full">
              <Image
                src="/photos/village1.jpg"
                alt="News from the Hands Village"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-base font-semibold">News from the Hands Village</h3>
              <p className="mt-2 text-sm text-zinc-700">
                Congratulations on Thomas’s graduation!
              </p>
            </div>
          </Card>

          <Card className="h-full overflow-hidden">
            <div className="relative h-44 w-full">
              <Image
                src="/photos/background1.jpg"
                alt="What's new in Hands’s Planet"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-base font-semibold">
                What&apos;s new in Hands’s Planet
              </h3>
              <div className="mt-4">
                <a
                  href="https://www.minecraft.net/en-us/about-minecraft"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <WorldUserMap />
      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">News</h2>
            <p className="mt-2 text-sm text-zinc-700">
              What’s on the farm this week: eggs, Hands&apos; Village dishes, and woodcraft.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-base font-semibold">Chicken and Eggs</h3>
            {eggsThisWeek.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-700">No updates this week.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
                {eggsThisWeek.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.categorySlug}/${p.slug}`}
                      className="hover:text-farm-700 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <Link
                href="/products/eggs"
                className="text-sm font-medium text-farm-800 hover:text-farm-900"
              >
                View all →
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold">Hands&apos; Village Dishes</h3>
            {foodThisWeek.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-700">No updates this week.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
                {foodThisWeek.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.categorySlug}/${p.slug}`}
                      className="hover:text-farm-700 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <Link
                href="/products/food"
                className="text-sm font-medium text-farm-800 hover:text-farm-900"
              >
                View all →
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold">Handmade Woodcraft</h3>
            {woodcraftThisWeek.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-700">No updates this week.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
                {woodcraftThisWeek.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.categorySlug}/${p.slug}`}
                      className="hover:text-farm-700 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <Link
                href="/products/woodcraft"
                className="text-sm font-medium text-farm-800 hover:text-farm-900"
              >
                View all →
              </Link>
            </div>
          </Card>
        </div>
      </section>


      <section className="mt-2">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Shop by category
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              Chicken, eggs and woodcraft are local pickup. Skincare ships via
              Lisa’s shop.
            </p>
          </div>
          <ButtonLink href="/products" variant="secondary" className="shrink-0">
            View all
          </ButtonLink>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.slug} className="p-6">
              <h3 className="text-base font-semibold">{c.name}</h3>
              <p className="mt-2 text-sm text-zinc-700">
                Explore {c.name.toLowerCase()} from our family.
              </p>
              <div className="mt-5">
                {c.slug === "skincare" ? (
                  <a
                    href={skincareUrl}
                    className="text-sm font-medium text-farm-800 hover:text-farm-900"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Browse {c.name} →
                  </a>
                ) : (
                  <Link
                    href={`/products/${c.slug}`}
                    className="text-sm font-medium text-farm-800 hover:text-farm-900"
                  >
                    Browse {c.name} →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {catalog.recipes.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Farm Recipes
              </h2>
              <p className="mt-2 text-sm text-zinc-700">
                Delicious ways to use our farm-fresh ingredients.
              </p>
            </div>
            <ButtonLink href="/recipes" variant="secondary" className="shrink-0">
              See all recipes
            </ButtonLink>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.recipes.slice(0, 3).map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative h-40 w-full">
                    <Image
                      src={recipe.imagePath || "/photos/background.jpg"}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold group-hover:text-farm-700">
                      {recipe.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
                      {recipe.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
