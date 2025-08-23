import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // For now, just pass through all requests without auth checks
  // This allows the app to load while we focus on the landing page
  return NextResponse.next({
    request,
  })
}
