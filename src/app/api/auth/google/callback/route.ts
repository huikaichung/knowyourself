/**
 * Google Sign-In Redirect Callback
 * Handles the redirect from Google OAuth and sets httpOnly cookies
 */

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const credential = formData.get('credential') as string;
    
    if (!credential) {
      return NextResponse.redirect(new URL('/?error=no_credential', request.url));
    }
    
    // Verify token with backend
    const backendResponse = await fetch(`${API_URL}/auth/google/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: credential }),
    });
    
    if (!backendResponse.ok) {
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
    
    const data = await backendResponse.json();
    
    // Get cookies from backend response
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    
    // Redirect to homepage with success
    const redirectUrl = new URL('/?login=success', request.url);
    const response = NextResponse.redirect(redirectUrl);
    
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
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
