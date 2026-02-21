'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../dashboard.module.css';

export default function PsychologyPage() {
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

  const tests = [
    {
      id: 'bigfive',
      name: 'Big Five 人格測驗',
      desc: '心理學界最廣泛使用的人格模型，測量五大面向：開放性、盡責性、外向性、親和性、神經質',
      questions: 60,
      time: '10-15 分鐘',
      color: '#3b82f6',
      status: 'available',
    },
    {
      id: 'mbti',
      name: 'MBTI 16型人格',
      desc: '榮格理論基礎的性格類型指標，分析你的認知功能偏好',
      questions: 70,
      time: '15-20 分鐘',
      color: '#10b981',
      status: 'coming',
    },
    {
      id: 'enneagram',
      name: '九型人格',
      desc: '深入探索你的核心動機、恐懼與渴望',
      questions: 36,
      time: '8-12 分鐘',
      color: '#f59e0b',
      status: 'coming',
    },
    {
      id: 'attachment',
      name: '依附風格',
      desc: '了解你在親密關係中的模式：安全型、焦慮型、迴避型',
      questions: 20,
      time: '5 分鐘',
      color: '#ec4899',
      status: 'coming',
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>心理測試</h1>
        <p>科學化的心理學測驗，深入了解自己</p>
      </header>

      <div className={styles.grid}>
        {tests.map((test) => (
          <div
            key={test.id}
            className={styles.card}
            style={{ 
              '--accent-color': test.color,
              opacity: test.status === 'coming' ? 0.6 : 1,
            } as React.CSSProperties}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.5rem',
            }}>
              <h2 style={{ fontSize: '1.1rem' }}>{test.name}</h2>
              {test.status === 'coming' && (
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                }}>
                  即將推出
                </span>
              )}
            </div>
            <p style={{ 
              color: '#888', 
              fontSize: '0.9rem', 
              marginBottom: '1rem',
              lineHeight: 1.5,
            }}>
              {test.desc}
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.8rem',
              color: '#666',
              marginBottom: '1rem',
            }}>
              <span>{test.questions} 題</span>
              <span>{test.time}</span>
            </div>
            {test.status === 'available' ? (
              <Link
                href={`/dashboard/psychology/${test.id}`}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  background: `linear-gradient(135deg, ${test.color}, ${test.color}dd)`,
                  borderRadius: '0.5rem',
                  color: 'white',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                開始測驗
              </Link>
            ) : (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0.5rem',
                textAlign: 'center',
                color: '#666',
              }}>
                即將推出
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
