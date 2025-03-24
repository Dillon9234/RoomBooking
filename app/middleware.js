// backend/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the response
  const response = NextResponse.next()

  // Add CORS headers to allow requests from the React frontend
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.FRONTEND_URL || '*'
  )
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  return response
}

export const config = {
  matcher: '/api/:path*',
}
