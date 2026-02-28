'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import styles from './page.module.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(true);
  
  const redirectTo = searchParams.get('redirect') || '/';

  // If already authenticated, redirect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  const handleLoginSuccess = () => {
    router.push(redirectTo);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.card}>
        <h1>登入以繼續</h1>
        <p className={styles.subtitle}>
          這個功能需要登入才能使用。<br/>
          登入後可以儲存你的說明書，隨時回來查看。
        </p>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          登入 / 註冊
        </button>

        <Link href="/" className={styles.backLink}>
          ← 返回首頁
        </Link>
      </div>

      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
      </div>

      <main className={styles.main}>
        <Suspense fallback={
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>載入中...</p>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>
    </div>
  );
}
