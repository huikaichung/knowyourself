'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithGoogle } from '@/lib/auth';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('登入已取消');
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    if (!code) {
      setError('無效的登入請求');
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    // Exchange code for tokens
    loginWithGoogle(code)
      .then(() => {
        // 登入成功，重導向到首頁或上一頁
        router.push('/');
      })
      .catch((err) => {
        console.error('Google login error:', err);
        setError(err.message || 'Google 登入失敗');
        setTimeout(() => router.push('/'), 3000);
      });
  }, [searchParams, router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
    }}>
      {error ? (
        <>
          <div style={{ 
            color: '#f87171', 
            marginBottom: '1rem',
            fontSize: '1.25rem',
          }}>
            {error}
          </div>
          <p style={{ color: '#888' }}>正在返回首頁...</p>
        </>
      ) : (
        <>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(168, 85, 247, 0.3)',
            borderTopColor: '#a855f7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem',
          }} />
          <p style={{ color: '#888' }}>正在登入...</p>
        </>
      )}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(168, 85, 247, 0.3)',
        borderTopColor: '#a855f7',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem',
      }} />
      <p style={{ color: '#888' }}>載入中...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
