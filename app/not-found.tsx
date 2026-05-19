import { ButtonLink } from "@/components/ui/Button" [modified]
import { EmptyState } from "@/components/ui/EmptyState"

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      message="That link doesn’t exist. Try heading back to the homepage."
      action={<ButtonLink href="/" variant="secondary">Go home</ButtonLink>}
    />
  )
}
