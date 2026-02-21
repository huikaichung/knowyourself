'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from './dashboard.module.css';

interface UserData {
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const sections = [
    {
      id: 'western',
      title: '西洋星盤',
      subtitle: '太陽、月亮、上升與行星',
      icon: '☉',
      color: '#f59e0b',
      href: '/dashboard/western',
    },
    {
      id: 'ziwei',
      title: '紫微斗數',
      subtitle: '命宮、十二宮與星曜',
      icon: '紫',
      color: '#8b5cf6',
      href: '/dashboard/ziwei',
    },
    {
      id: 'humandesign',
      title: '人類圖',
      subtitle: '類型、策略與閘門',
      icon: '◇',
      color: '#ec4899',
      href: '/dashboard/humandesign',
    },
    {
      id: 'psychology',
      title: '心理測試',
      subtitle: 'Big Five、MBTI、九型人格',
      icon: '🧠',
      color: '#06b6d4',
      href: '/dashboard/psychology',
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>你的使用說明書</h1>
        <p>歡迎回來，{user.name || user.email}</p>
      </header>

      {!userData?.birthDate && (
        <div className={styles.setupBanner}>
          <p>尚未設定出生資料</p>
          <Link href="/consult" className={styles.setupBtn}>
            開始設定
          </Link>
        </div>
      )}

      <div className={styles.grid}>
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className={styles.card}
            style={{ '--accent-color': section.color } as React.CSSProperties}
          >
            <div className={styles.cardIcon}>{section.icon}</div>
            <h2>{section.title}</h2>
            <p>{section.subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
