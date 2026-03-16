'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../destiny.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art/api/v1';

interface HumanDesignData {
  type: string;
  type_en: string;
  strategy: string;
  strategy_en: string;
  authority: string;
  authority_en: string;
  profile: string;
  personality_gates: number[];
  design_gates: number[];
  channels: Array<{ gate1: number; gate2: number; name?: string }>;
  defined_centers: string[];
  calculation_method?: string;
}

export default function HumanDesignPage() {
  const { user, birthInfo, hasBirthInfo, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<HumanDesignData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const fetchData = useCallback(async () => {
    if (!birthInfo?.birth_date || !birthInfo?.birth_time) return;

    setDataLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/manual/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_info: {
            birth_date: birthInfo.birth_date,
            birth_time: birthInfo.birth_time,
            birth_place: birthInfo.birth_place,
            latitude: birthInfo.latitude,
            longitude: birthInfo.longitude,
            timezone: birthInfo.timezone,
            gender: birthInfo.gender,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const result = await res.json();
      const hd = result.deep_data?.human_design;
      
      if (hd) {
        setData(hd);
      } else {
        setError('無法取得人類圖資料');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('載入失敗，請稍後再試');
    } finally {
      setDataLoading(false);
    }
  }, [birthInfo]);

  useEffect(() => {
    if (hasBirthInfo && birthInfo?.birth_time && !data && !dataLoading) {
      fetchData();
    }
  }, [hasBirthInfo, birthInfo?.birth_time, data, dataLoading, fetchData]);

  if (authLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) return null;

  const needsBirthTime = hasBirthInfo && !birthInfo?.birth_time;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>人類圖</h1>
        {data?.calculation_method && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            計算方式: {data.calculation_method}
          </p>
        )}
      </header>

      {!hasBirthInfo ? (
        <div className={styles.setupBanner}>
          <p>尚未設定出生資料</p>
          <Link href="/dashboard/settings" className={styles.setupBtn}>設定出生資料</Link>
        </div>
      ) : needsBirthTime ? (
        <div className={styles.setupBanner}>
          <p>人類圖需要精確出生時間</p>
          <Link href="/dashboard/settings" className={styles.setupBtn}>補充出生時間</Link>
        </div>
      ) : dataLoading ? (
        <div className={styles.loading}>正在計算...</div>
      ) : error ? (
        <div className={styles.setupBanner}>
          <p>{error}</p>
          <button onClick={fetchData} className={styles.setupBtn}>重試</button>
        </div>
      ) : data ? (
        <>
          {/* 核心資訊 */}
          <div className={styles.grid}>
            <div className={styles.card} style={{ '--accent-color': '#8b5cf6' } as React.CSSProperties}>
              <div className={styles.cardIcon}>🔮</div>
              <h2>類型</h2>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.type}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{data.type_en}</p>
            </div>
            <div className={styles.card} style={{ '--accent-color': '#06b6d4' } as React.CSSProperties}>
              <div className={styles.cardIcon}>🧭</div>
              <h2>策略</h2>
              <p style={{ fontSize: '1rem' }}>{data.strategy}</p>
            </div>
            <div className={styles.card} style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
              <div className={styles.cardIcon}>⚖️</div>
              <h2>內在權威</h2>
              <p style={{ fontSize: '1rem' }}>{data.authority}</p>
            </div>
            <div className={styles.card} style={{ '--accent-color': '#ec4899' } as React.CSSProperties}>
              <div className={styles.cardIcon}>👤</div>
              <h2>人生角色</h2>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.profile}</p>
            </div>
          </div>

          {/* 能量中心 */}
          {data.defined_centers && data.defined_centers.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>定義能量中心</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.defined_centers.map((center, i) => (
                  <span key={i} style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                  }}>
                    {center}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 通道 */}
          {data.channels && data.channels.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>通道 ({data.channels.length})</h3>
              <div className={styles.list}>
                {data.channels.map((ch, i) => (
                  <div key={i} className={styles.listItem}>
                    <span>{ch.gate1} — {ch.gate2}</span>
                    {ch.name && <span style={{ color: 'rgba(255,255,255,0.6)' }}>{ch.name}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 閘門 */}
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                個性閘門 (黑) - {data.personality_gates?.length || 0}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {data.personality_gates?.map((gate, i) => (
                  <span key={i} style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}>
                    {gate}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                設計閘門 (紅) - {data.design_gates?.length || 0}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {data.design_gates?.map((gate, i) => (
                  <span key={i} style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}>
                    {gate}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={fetchData} disabled={dataLoading} className={styles.setupBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {dataLoading ? '計算中...' : '重新計算'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
