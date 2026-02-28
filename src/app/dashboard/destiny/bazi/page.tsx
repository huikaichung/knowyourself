'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import styles from '../destiny.module.css';

export default function BaziPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 從 API 載入用戶的八字數據
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
          <h1>八字命理</h1>
          <p>四柱八字與五行分析</p>
        </header>

        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>八</span>
          <h2>尚未設定出生資料</h2>
          <p>請先在首頁輸入你的出生資訊，才能查看八字命盤</p>
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
        <h1>八字命理</h1>
        <p>四柱八字與五行分析</p>
      </header>

      <div className={styles.content}>
        {/* TODO: 顯示八字數據 */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
