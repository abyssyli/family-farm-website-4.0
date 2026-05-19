import { Card, CardBody } from "./Card"

export function LoadingState({ label }: { label: string }) {
  return (
    <Card> [modified]
      <CardBody>
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-farm-700" />
          <p className="text-sm text-zinc-700">{label}</p>
        </div>
      </CardBody>
    </Card>
  )
}
