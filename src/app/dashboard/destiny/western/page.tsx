'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../destiny.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art';

interface WesternData {
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  sun_degree?: number;
  moon_degree?: number;
  asc_degree?: number;
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house?: number;
    retrograde?: boolean;
  }>;
  aspects?: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
  calculation_method?: string;
}

export default function WesternPage() {
  const { user, birthInfo, hasBirthInfo, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<WesternData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '總覽' },
    { id: 'planets', label: '行星' },
    { id: 'aspects', label: '相位' },
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch Western chart data
  const fetchWesternData = useCallback(async () => {
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

      if (!res.ok) {
        throw new Error('Failed to fetch chart data');
      }

      const result = await res.json();
      const western = result.deep_data?.western;
      
      if (western) {
        setData(western);
      } else {
        setError('無法取得星盤資料');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('載入失敗，請稍後再試');
    } finally {
      setDataLoading(false);
    }
  }, [birthInfo]);

  // Auto-fetch when birthInfo is available
  useEffect(() => {
    if (hasBirthInfo && !data && !dataLoading) {
      fetchWesternData();
    }
  }, [hasBirthInfo, data, dataLoading, fetchWesternData]);

  if (authLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>西洋星盤</h1>
        {data?.calculation_method && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
            計算方式: {data.calculation_method}
          </p>
        )}
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
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'rgba(255,255,255,0.05)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 狀態處理 */}
      {!hasBirthInfo ? (
        <div className={styles.setupBanner}>
          <p>尚未設定出生資料</p>
          <Link href="/dashboard/settings" className={styles.setupBtn}>
            設定出生資料
          </Link>
        </div>
      ) : dataLoading ? (
        <div className={styles.loading}>
          <p>正在計算星盤...</p>
        </div>
      ) : error ? (
        <div className={styles.setupBanner}>
          <p>{error}</p>
          <button onClick={fetchWesternData} className={styles.setupBtn}>
            重試
          </button>
        </div>
      ) : data ? (
        <>
          {activeTab === 'overview' && (
            <div className={styles.grid}>
              {/* 太陽 */}
              <div className={styles.card} style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
                <div className={styles.cardIcon}>☉</div>
                <h2>太陽 {data.sun_sign}</h2>
                {data.sun_degree && <p>{data.sun_degree.toFixed(1)}°</p>}
              </div>

              {/* 月亮 */}
              <div className={styles.card} style={{ '--accent-color': '#94a3b8' } as React.CSSProperties}>
                <div className={styles.cardIcon}>☽</div>
                <h2>月亮 {data.moon_sign}</h2>
                {data.moon_degree && <p>{data.moon_degree.toFixed(1)}°</p>}
              </div>

              {/* 上升 */}
              <div className={styles.card} style={{ '--accent-color': '#ec4899' } as React.CSSProperties}>
                <div className={styles.cardIcon}>ASC</div>
                <h2>上升 {data.rising_sign}</h2>
                {data.asc_degree && <p>{data.asc_degree.toFixed(1)}°</p>}
              </div>
            </div>
          )}

          {activeTab === 'planets' && data.planets && (
            <div className={styles.list}>
              {data.planets.map((planet, i) => (
                <div key={i} className={styles.listItem}>
                  <span className={styles.planetName}>
                    {planet.name} {planet.retrograde && '℞'}
                  </span>
                  <span className={styles.planetSign}>{planet.sign}</span>
                  <span className={styles.planetDegree}>{planet.degree.toFixed(1)}°</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'aspects' && data.aspects && (
            <div className={styles.list}>
              {data.aspects.map((aspect, i) => (
                <div key={i} className={styles.listItem}>
                  <span>{aspect.planet1}</span>
                  <span className={styles.aspectType}>{aspect.aspect}</span>
                  <span>{aspect.planet2}</span>
                  <span className={styles.orb}>orb {aspect.orb.toFixed(1)}°</span>
                </div>
              ))}
            </div>
          )}

          {/* 重新計算按鈕 */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={fetchWesternData}
              disabled={dataLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {dataLoading ? '計算中...' : '重新計算'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
