'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../destiny.module.css';

export default function ZiweiPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
    setDataLoading(false);
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: '總覽', href: '/dashboard/ziwei' },
    { id: 'palaces', label: '十二宮', href: '/dashboard/ziwei/palaces' },
    { id: 'stars', label: '星曜', href: '/dashboard/ziwei/stars' },
    { id: 'yearly', label: '流年', href: '/dashboard/ziwei/yearly' },
  ];

  const palaces = [
    '命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮',
    '遷移宮', '交友宮', '事業宮', '田宅宮', '福德宮', '父母宮'
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>紫微斗數</h1>
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
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
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

      {/* 十二宮格子 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {/* 紫微盤布局: 4x4 網格，中間空白 */}
        {[
          { palace: '巳', idx: 4 },
          { palace: '午', idx: 5 },
          { palace: '未', idx: 6 },
          { palace: '申', idx: 7 },
          { palace: '辰', idx: 3 },
          null, // 中間空白
          null, // 中間空白
          { palace: '酉', idx: 8 },
          { palace: '卯', idx: 2 },
          null, // 中間空白
          null, // 中間空白
          { palace: '戌', idx: 9 },
          { palace: '寅', idx: 1 },
          { palace: '丑', idx: 0 },
          { palace: '子', idx: 11 },
          { palace: '亥', idx: 10 },
        ].map((cell, i) => (
          cell ? (
            <div
              key={i}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                minHeight: '80px',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{cell.palace}</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {palaces[cell.idx]}
              </div>
            </div>
          ) : (
            <div key={i} style={{ minHeight: '80px' }} />
          )
        ))}
      </div>

      <div className={styles.setupBanner} style={{ marginTop: '2rem' }}>
        <p>詳細命盤資訊需要完整的出生資料</p>
        <Link href="/consult" className={styles.setupBtn}>
          開始設定
        </Link>
      </div>
    </div>
  );
}
