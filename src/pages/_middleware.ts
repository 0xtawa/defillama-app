import { NextRequest, NextResponse } from 'next/server'
import { dataFilters } from 'utils/cookies'

export function middleware(req: NextRequest) {
  const { nextUrl: url } = req

  for (const filter of Object.values(dataFilters)) {
    const cookieValue = JSON.parse(req.cookies[filter] || 'false')
    url.searchParams.set(filter, cookieValue)
  }
  console.log(url)
  return NextResponse.rewrite(url)
}
