export const runtime = 'nodejs'

export async function POST() {
  return Response.json(
    { error: 'Not implemented. This endpoint was referenced by /transform.' },
    { status: 501 },
  )
}

