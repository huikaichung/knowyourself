'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../dashboard.module.css';

interface WesternData {
  sun: { sign: string; degree: number; house?: number };
  moon: { sign: string; degree: number; house?: number };
  ascendant: { sign: string; degree: number };
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house?: number;
    retrograde?: boolean;
  }>;
  houses?: Array<{ house: number; sign: string; degree: number }>;
  aspects?: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
}

export default function WesternPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<WesternData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // TODO: 從 API 載入用戶的星盤數據
  useEffect(() => {
    // 模擬載入
    setDataLoading(false);
  }, []);

  if (authLoading || dataLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: '總覽', href: '/dashboard/western' },
    { id: 'planets', label: '行星', href: '/dashboard/western/planets' },
    { id: 'houses', label: '宮位', href: '/dashboard/western/houses' },
    { id: 'aspects', label: '相位', href: '/dashboard/western/aspects' },
    { id: 'transits', label: '流年', href: '/dashboard/western/transits' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>西洋星盤</h1>
      </header>

      {/* 導航標籤 */}
      <nav style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
      }}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: tab.id === 'overview' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'rgba(255,255,255,0.05)',
              color: 'white',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* 主要內容 */}
      {!data ? (
        <div className={styles.setupBanner}>
          <p>尚未設定出生資料，無法顯示星盤</p>
          <Link href="/consult" className={styles.setupBtn}>
            開始設定
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* 太陽 */}
          <div className={styles.card} style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
            <div className={styles.cardIcon}>☉</div>
            <h2>太陽 {data.sun.sign}</h2>
            <p>{data.sun.degree.toFixed(1)}° {data.sun.house && `· 第 ${data.sun.house} 宮`}</p>
          </div>

          {/* 月亮 */}
          <div className={styles.card} style={{ '--accent-color': '#94a3b8' } as React.CSSProperties}>
            <div className={styles.cardIcon}>☽</div>
            <h2>月亮 {data.moon.sign}</h2>
            <p>{data.moon.degree.toFixed(1)}° {data.moon.house && `· 第 ${data.moon.house} 宮`}</p>
          </div>

          {/* 上升 */}
          <div className={styles.card} style={{ '--accent-color': '#ec4899' } as React.CSSProperties}>
            <div className={styles.cardIcon}>ASC</div>
            <h2>上升 {data.ascendant.sign}</h2>
            <p>{data.ascendant.degree.toFixed(1)}°</p>
          </div>
        </div>
      )}
    </div>
  );
}
