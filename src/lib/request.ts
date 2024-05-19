interface Props {
  url: string
  body?: any
  server?: boolean
}
export default async function request({ url, body, server }: Props) {
  const baseUrl = server ? process.env.NEXT_PUBLIC_API_URL : '/api'
  const response = await fetch(baseUrl + url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...(body ?? {}),
    }),
  })
  console.log(response.status, body, await response.text())

  // const data = await response.json()
  return response
}
