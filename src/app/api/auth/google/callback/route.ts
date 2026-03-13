/**
 * Google Sign-In Redirect Callback
 * Handles the redirect from Google OAuth and sets httpOnly cookies
 */

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://knowyourself.selfkit.art';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const credential = formData.get('credential') as string;
    
    if (!credential) {
      console.error('No credential in form data');
      return NextResponse.redirect(`${BASE_URL}/?error=no_credential`);
    }
    
    // Verify token with backend
    const backendResponse = await fetch(`${API_URL}/auth/google/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: credential }),
    });
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend auth failed:', errorText);
      return NextResponse.redirect(`${BASE_URL}/?error=auth_failed`);
    }
    
    const data = await backendResponse.json();
    
    // Get cookies from backend response
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    
    // Redirect to homepage with success
    const response = NextResponse.redirect(`${BASE_URL}/?login=success`);
    
    // Forward cookies from backend
    if (setCookieHeader) {
      // Parse and set each cookie
      const cookies = setCookieHeader.split(',').map(c => c.trim());
      for (const cookie of cookies) {
        response.headers.append('Set-Cookie', cookie);
      }
    }
    
    // Store user info in a non-httpOnly cookie for frontend access
    if (data.user) {
      response.cookies.set('kys_user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatar_url: data.user.avatar_url,
      }), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
    }
    
    return response;
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(`${BASE_URL}/?error=server_error`);
  }
}

// Also handle GET for debugging
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(`${BASE_URL}/?error=${error}`);
  }
  
  return NextResponse.redirect(`${BASE_URL}/?error=invalid_request`);
}
