export interface HandlerRequest {
  body: unknown
  query: Record<string, string | string[] | undefined>
  params: Record<string, string | undefined>
  cookieHeader: string | null
  ip: string | null
}

export interface HandlerResult {
  statusCode: number
  body: unknown
  setCookie?: string
}
