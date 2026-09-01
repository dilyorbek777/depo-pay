'use client'

import NotFound from "./not-found"


export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <NotFound />
    </div>
  )
}