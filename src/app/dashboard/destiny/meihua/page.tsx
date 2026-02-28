'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import styles from '../destiny.module.css';

export default function MeihuaPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 從 API 載入用戶的梅花易數數據
    setLoading(false);
    setData(null);
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>載入中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>梅花易數</h1>
          <p>卦象與體用分析</p>
        </header>

        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>☯</span>
          <h2>尚未設定出生資料</h2>
          <p>請先在首頁輸入你的出生資訊，才能查看梅花易數</p>
          <a href="/" className={styles.ctaButton}>
            前往設定
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>梅花易數</h1>
        <p>卦象與體用分析</p>
      </header>

      <div className={styles.content}>
        {/* TODO: 顯示梅花易數數據 */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
