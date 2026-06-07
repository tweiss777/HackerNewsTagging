export class HttpError extends Error {
  readonly status: number
  readonly statusText: string

  constructor(status: number, statusText: string, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
  }
}

export async function fetchWrapper<T>(requestInfo: RequestInfo): Promise<T> {
  const response = await fetch(requestInfo)
  if (response.ok) {
    return response.json() as Promise<T>
  }
  const message = await response.text()
  throw new HttpError(response.status, response.statusText, message)
}
