'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function AuthCallbackContent() {
  const router = useRouter();

  useEffect(() => {
    // Firebase Auth uses popup, no callback needed
    // Just redirect to home
    router.push('/');
  }, [router]);

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
      <p style={{ color: '#888' }}>正在跳轉...</p>
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
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      <p style={{ color: '#888' }}>載入中...</p>
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
