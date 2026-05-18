import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/takeaway-restaurants')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/takeaway-restaurants"!</div>
}
