
/* minor adjust */
export function sortCategorySlugsByPreference(
  categorySlugs: string[],
  preferred: string[] | null | undefined
) {
  if (!preferred || preferred.length === 0) return categorySlugs
  const rank = new Map(preferred.map((slug, idx) => [slug, idx]))
  return [...categorySlugs].sort((a, b) => {
    const ra = rank.has(a) ? rank.get(a)! : Number.POSITIVE_INFINITY
    const rb = rank.has(b) ? rank.get(b)! : Number.POSITIVE_INFINITY
    if (ra !== rb) return ra - rb
    return a.localeCompare(b)
  })
}

