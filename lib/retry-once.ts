// Retry network failures and transient HTTP failures once. Keep the second
// attempt outside the catch so a second rejection propagates to the handler.
export async function retryOnce(ask: () => Promise<Response>): Promise<Response> {
  let response: Response
  try {
    response = await ask()
  } catch {
    return ask()
  }

  const rateLimited = response.status === 403 && (
    response.headers.get('X-RateLimit-Remaining') === '0' ||
    response.headers.has('Retry-After')
  )
  const transient = response.status === 408 || response.status === 429 ||
    (response.status >= 500 && response.status <= 599) || rateLimited
  if (!transient) return response

  // Release the unused body before opening another upstream request.
  await response.body?.cancel().catch(() => {})
  return ask()
}
