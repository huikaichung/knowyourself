/**
 * Google Sign-In Redirect Callback
 * Handles the redirect from Google OAuth and sets httpOnly cookies
 */

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art/api/v1';
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
    
    // Get return URL from cookie (set before OAuth redirect)
    const returnUrlCookie = request.cookies.get('kys_return_url')?.value;
    let redirectUrl = `${BASE_URL}/dashboard`;  // Default to dashboard after login
    
    if (returnUrlCookie) {
      try {
        const decodedUrl = decodeURIComponent(returnUrlCookie);
        // Validate it's from our domain
        const url = new URL(decodedUrl);
        if (url.origin === BASE_URL || url.hostname === 'localhost') {
          redirectUrl = decodedUrl;
        }
      } catch {
        // Invalid URL, use default
      }
    }
    
    // Create redirect response
    const response = NextResponse.redirect(redirectUrl);
    
    // Clear the return_url cookie
    response.cookies.set('kys_return_url', '', { path: '/', maxAge: 0 });
    
    // Extract and forward Set-Cookie headers from backend
    const setCookieHeaders = backendResponse.headers.getSetCookie?.() || [];
    
    // If getSetCookie is not available, try raw header
    if (setCookieHeaders.length === 0) {
      const rawSetCookie = backendResponse.headers.get('set-cookie');
      if (rawSetCookie) {
        // Split by comma but be careful with Expires dates
        const cookies = rawSetCookie.split(/,(?=\s*[^;]+=[^;]+)/).map(c => c.trim());
        for (const cookie of cookies) {
          response.headers.append('Set-Cookie', cookie);
        }
      }
    } else {
      for (const cookie of setCookieHeaders) {
        response.headers.append('Set-Cookie', cookie);
      }
    }
    
    // Also set user info in a readable cookie for the frontend
    if (data.user) {
      const userJson = JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatar_url: data.user.avatar_url,
      });
      
      response.cookies.set('kys_user', userJson, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: true,
      });
      
      // Also set in localStorage via a flag
      response.cookies.set('kys_auth', '1', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: true,
      });
    }
    
    return response;
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(`${BASE_URL}/?error=server_error`);
  }
}

// Handle GET for debugging
export async function GET() {
  return NextResponse.redirect(`${BASE_URL}/?error=invalid_method`);
}
