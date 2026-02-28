'use client';

import { useEffect, useRef, useState } from 'react';
import { initGoogleSignIn, AuthUser } from '@/lib/google-auth';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isOpen || !buttonRef.current || initialized) return;

    setLoading(true);
    setError(null);

    initGoogleSignIn(
      buttonRef.current,
      (user) => {
        onSuccess?.(user);
        onClose();
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    ).then(() => {
      setLoading(false);
      setInitialized(true);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [isOpen, initialized, onSuccess, onClose]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        <h2 className={styles.title}>登入</h2>
        <p className={styles.subtitle}>
          使用 Google 帳號登入，即可儲存你的分析結果
        </p>

        {error && <p className={styles.error}>{error}</p>}

        {loading && !error && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>載入中...</p>
          </div>
        )}

        {/* Google Sign-In button will be rendered here */}
        <div 
          ref={buttonRef} 
          className={styles.googleButtonContainer}
          style={{ display: loading && !error ? 'none' : 'flex' }}
        />

        <p className={styles.privacy}>
          登入即表示同意我們的服務條款
        </p>
      </div>
    </div>
  );
}
