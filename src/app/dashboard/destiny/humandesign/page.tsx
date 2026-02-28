'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../destiny.module.css';

export default function HumanDesignPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: '總覽', href: '/dashboard/humandesign' },
    { id: 'type', label: '類型', href: '/dashboard/humandesign/type' },
    { id: 'centers', label: '能量中心', href: '/dashboard/humandesign/centers' },
    { id: 'gates', label: '閘門', href: '/dashboard/humandesign/gates' },
    { id: 'channels', label: '通道', href: '/dashboard/humandesign/channels' },
  ];

  const types = [
    { name: '顯示者', desc: '開創、發起', pct: '9%' },
    { name: '生產者', desc: '回應、建造', pct: '37%' },
    { name: '顯示生產者', desc: '回應、多工', pct: '33%' },
    { name: '投射者', desc: '引導、等待邀請', pct: '20%' },
    { name: '反映者', desc: '反映、等待月循環', pct: '1%' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>人類圖</h1>
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
                ? 'linear-gradient(135deg, #ec4899, #db2777)' 
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

      {/* 類型介紹 */}
      <h2 style={{ marginBottom: '1rem' }}>五種類型</h2>
      <div className={styles.grid}>
        {types.map((type) => (
          <div
            key={type.name}
            className={styles.card}
            style={{ '--accent-color': '#ec4899' } as React.CSSProperties}
          >
            <h3>{type.name}</h3>
            <p style={{ color: '#888', marginBottom: '0.5rem' }}>{type.desc}</p>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>人口佔比 {type.pct}</p>
          </div>
        ))}
      </div>

      <div className={styles.setupBanner} style={{ marginTop: '2rem' }}>
        <p>查看你的人類圖類型與詳細分析</p>
        <Link href="/consult" className={styles.setupBtn}>
          開始設定
        </Link>
      </div>
    </div>
  );
}
