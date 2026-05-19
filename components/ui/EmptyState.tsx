import { Card, CardBody } from "./Card"

export function EmptyState({
  title,
  message,
  action [modified]
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{message}</p>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </CardBody>
    </Card>
  )
}
