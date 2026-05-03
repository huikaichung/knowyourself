'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { getDetailByBirth } from '@/lib/api';
import Link from 'next/link';
import styles from '../destiny.module.css';

interface Palace {
  name: string;
  branch: string;
  major_stars: string[];
  minor_stars: string[];
  sihua: string[];
}

interface ZiweiData {
  lunar_date: string;
  year_pillar: string;
  wu_xing_ju: string;
  ming_gong_branch: string;
  shen_gong_branch: string;
  palaces: Palace[];
  calculation_method?: string;
}

export default function ZiweiPage() {
  const { user, birthInfo, hasBirthInfo, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ZiweiData | null>(null);
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
      const result = await getDetailByBirth('ziwei', birthInfo);
      const d = result.data as Record<string, unknown>;
      const chart = (d.chart ?? d) as Record<string, unknown>;
      setData({
        lunar_date: (chart.lunar_date ?? '') as string,
        year_pillar: (chart.year_pillar ?? '') as string,
        wu_xing_ju: (chart.wu_xing_ju ?? '') as string,
        ming_gong_branch: (chart.ming_gong ?? chart.ming_gong_branch ?? '') as string,
        shen_gong_branch: (chart.shen_gong ?? chart.shen_gong_branch ?? '') as string,
        palaces: (chart.palaces ?? []) as Palace[],
        calculation_method: chart.calculation_method as string | undefined,
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setDataLoading(false);
    }
  }, [birthInfo]);

  useEffect(() => {
    if (hasBirthInfo && !data && !dataLoading && !error) {
      fetchData();
    }
  }, [hasBirthInfo, data, dataLoading, error, fetchData]);

  if (authLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>紫微斗數</h1>
        {data?.calculation_method && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            計算方式: {data.calculation_method}
          </p>
        )}
      </header>

      {!hasBirthInfo ? (
        <div className={styles.setupBanner}>
          <p>尚未設定出生資料</p>
          <Link href="/dashboard/settings" className={styles.setupBtn}>
            設定出生資料
          </Link>
        </div>
      ) : !birthInfo?.gender ? (
        <div className={styles.setupBanner}>
          <p>紫微斗數需要性別資訊</p>
          <Link href="/dashboard/settings" className={styles.setupBtn}>
            補充性別
          </Link>
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
          {/* 基本資訊 */}
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📅</div>
              <h2>農曆</h2>
              <p>{data.lunar_date}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🏛️</div>
              <h2>命宮</h2>
              <p>{data.ming_gong_branch}宮</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>👤</div>
              <h2>身宮</h2>
              <p>{data.shen_gong_branch}宮</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⭐</div>
              <h2>五行局</h2>
              <p>{data.wu_xing_ju}</p>
            </div>
          </div>

          {/* 十二宮 */}
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>十二宮位</h2>
          <div className={styles.list}>
            {data.palaces.map((palace, i) => (
              <div key={i} className={styles.listItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 600 }}>{palace.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{palace.branch}</span>
                </div>
                {palace.major_stars.length > 0 && (
                  <div style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: '#f59e0b' }}>主星:</span> {palace.major_stars.join('、')}
                    {palace.sihua.length > 0 && <span style={{ color: '#ec4899', marginLeft: '0.5rem' }}>{palace.sihua.join(' ')}</span>}
                  </div>
                )}
                {palace.minor_stars.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    輔星: {palace.minor_stars.join('、')}
                  </div>
                )}
              </div>
            ))}
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
