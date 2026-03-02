'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../destiny.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art';

interface Pillar {
  stem: string;
  branch: string;
  hidden_stems: string[];
  nayin: string;
}

interface BaziData {
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  day_master: string;
  day_master_strength: string;
  useful_god: string;
  useful_god_reasoning: string;
  five_elements: Record<string, number>;
  calculation_method?: string;
}

export default function BaziPage() {
  const { user, birthInfo, hasBirthInfo, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<BaziData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const fetchData = useCallback(async () => {
    if (!birthInfo?.birth_date) return;

    setDataLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/manual/generate`, {
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
      const bazi = result.deep_data?.chinese?.bazi;
      
      if (bazi) {
        setData(bazi);
      } else {
        setError('無法取得八字資料');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('載入失敗，請稍後再試');
    } finally {
      setDataLoading(false);
    }
  }, [birthInfo]);

  useEffect(() => {
    if (hasBirthInfo && !data && !dataLoading) {
      fetchData();
    }
  }, [hasBirthInfo, data, dataLoading, fetchData]);

  if (authLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) return null;

  const pillarNames = ['年柱', '月柱', '日柱', '時柱'];
  const pillarKeys = ['year', 'month', 'day', 'hour'] as const;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>八字命盤</h1>
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
      ) : dataLoading ? (
        <div className={styles.loading}>正在排盤...</div>
      ) : error ? (
        <div className={styles.setupBanner}>
          <p>{error}</p>
          <button onClick={fetchData} className={styles.setupBtn}>重試</button>
        </div>
      ) : data ? (
        <>
          {/* 四柱 */}
          <div className={styles.grid}>
            {pillarKeys.map((key, i) => {
              const pillar = data.pillars[key];
              return (
                <div key={key} className={styles.card}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                    {pillarNames[i]}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {pillar.stem}{pillar.branch}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                    {pillar.nayin}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 日主分析 */}
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem' }}>命主分析</h3>
            <div className={styles.grid}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>日主</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.day_master}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>身強/身弱</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.day_master_strength}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>用神</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b' }}>{data.useful_god}</div>
              </div>
            </div>
            {data.useful_god_reasoning && (
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                {data.useful_god_reasoning}
              </p>
            )}
          </div>

          {/* 五行分佈 */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>五行分佈</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Object.entries(data.five_elements).map(([element, count]) => (
                <div key={element} style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem' }}>{element}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={fetchData} disabled={dataLoading} className={styles.setupBtn} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {dataLoading ? '計算中...' : '重新排盤'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
