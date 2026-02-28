'use client';

import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from './page.module.css';

const QUICK_ACTIONS = [
  {
    title: '查看星盤',
    description: '西洋占星的行星與宮位',
    href: '/dashboard/destiny/western',
    icon: '☉',
    color: '#f59e0b',
  },
  {
    title: '紫微命盤',
    description: '十二宮與主星分析',
    href: '/dashboard/destiny/ziwei',
    icon: '紫',
    color: '#8b5cf6',
  },
  {
    title: '人格測驗',
    description: '探索你的性格特質',
    href: '/dashboard/psychology/bigfive',
    icon: '🧠',
    color: '#10b981',
  },
  {
    title: 'AI 諮詢',
    description: '結合數據的深度對話',
    href: '/dashboard/consult',
    icon: '💬',
    color: '#3b82f6',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          歡迎回來{user?.name ? `，${user.name}` : ''}
        </h1>
        <p className={styles.subtitle}>
          選擇左側選單探索你的使用說明書，或從下方快速開始
        </p>
      </header>

      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>快速開始</h2>
        <div className={styles.grid}>
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={styles.card}
              style={{ '--accent-color': action.color } as React.CSSProperties}
            >
              <span className={styles.cardIcon}>{action.icon}</span>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{action.title}</h3>
                <p className={styles.cardDesc}>{action.description}</p>
              </div>
              <span className={styles.cardArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>使用指南</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>📊 命盤系統</h3>
            <p>結合西洋占星、紫微斗數、八字等五大體系，從不同角度解讀你的特質。</p>
          </div>
          <div className={styles.infoCard}>
            <h3>🧪 心理測驗</h3>
            <p>科學化的人格測驗，包含 Big Five、MBTI、九型人格等，了解你的行為模式。</p>
          </div>
          <div className={styles.infoCard}>
            <h3>💬 AI 諮詢</h3>
            <p>整合所有測驗與命盤數據，提供個人化的深度解讀與建議。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
