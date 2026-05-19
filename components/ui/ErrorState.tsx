import { Card, CardBody } from "./Card"

export function ErrorState({
  title,
  message,
  action
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <Card className="border-red-200">
      <CardBody>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold text-red-900">{title}</h2>
            <p className="mt-1 text-sm text-red-800">{message}</p>
          </div>
          {action ? <div>{action}</div> : null}
        </div> [modified]
      </CardBody>
    </Card>
  )
}
