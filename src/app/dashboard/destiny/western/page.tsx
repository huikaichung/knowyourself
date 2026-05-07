'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { getDetailByBirth } from '@/lib/api';
import Link from 'next/link';
import styles from '../destiny.module.css';

interface PlanetEntry {
  name: string;
  sign: string;
  degree: number;
  house?: number;
  retrograde?: boolean;
  interpretation?: string;
}

interface AspectEntry {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  interpretation?: string;
}

interface WesternReadings {
  personality?: string;
  career_wealth?: string;
  fame_office?: string;
  marriage?: string;
  family_origin?: string;
  growth_path?: string;
}

interface WesternData {
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  sun_degree?: number;
  moon_degree?: number;
  asc_degree?: number;
  ascendant_interpretation?: string;
  midheaven_interpretation?: string;
  planets: PlanetEntry[];
  aspects?: AspectEntry[];
  chart_pattern?: string;
  dominant_element?: string;
  summary?: string;
  readings?: WesternReadings;
  calculation_method?: string;
}

const READING_LABELS: Array<{ key: keyof WesternReadings; label: string }> = [
  { key: 'personality',    label: '性格特質' },
  { key: 'career_wealth',  label: '事業財運' },
  { key: 'fame_office',    label: '名聲地位' },
  { key: 'marriage',       label: '感情婚姻' },
  { key: 'family_origin',  label: '原生家庭' },
  { key: 'growth_path',    label: '成長課題' },
];

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

  const fetchWesternData = useCallback(async () => {
    if (!birthInfo?.birth_date) return;
    setDataLoading(true);
    setError(null);
    try {
      const result = await getDetailByBirth('western', birthInfo);
      const d = result.data as Record<string, unknown>;
      const interp = (d.interpretations ?? {}) as Record<string, unknown>;

      const rawPlanets = (d.planets ?? []) as PlanetEntry[];
      const sunPlanet = rawPlanets.find((p) => p.name === 'Sun' || p.name === '太陽');
      const moonPlanet = rawPlanets.find((p) => p.name === 'Moon' || p.name === '月亮');
      const asc = (d.ascendant ?? {}) as { sign?: string; degree?: number };

      // AI returns planets/aspects with interpretations. Match by name (planets)
      // and key (aspects) to merge structured data + AI text.
      const aiPlanets = (interp.planets ?? []) as Array<{ name?: string; interpretation?: string }>;
      const planetInterpByName = new Map<string, string>();
      for (const ap of aiPlanets) {
        if (ap.name && ap.interpretation) planetInterpByName.set(ap.name, ap.interpretation);
      }
      const planets: PlanetEntry[] = rawPlanets.map(p => ({
        ...p,
        interpretation: planetInterpByName.get(p.name),
      }));

      const aiAspects = (interp.aspects ?? []) as Array<{ key?: string; interpretation?: string }>;
      const aspectInterpByKey = new Map<string, string>();
      for (const aa of aiAspects) {
        if (aa.key && aa.interpretation) aspectInterpByKey.set(aa.key, aa.interpretation);
      }
      const rawAspects = (d.aspects ?? []) as AspectEntry[];
      const aspects: AspectEntry[] = rawAspects.map(a => ({
        ...a,
        interpretation: aspectInterpByKey.get(`${a.planet1}-${a.aspect}-${a.planet2}`),
      }));

      const ascInt = (interp.ascendant ?? {}) as { interpretation?: string };
      const mcInt = (interp.midheaven ?? {}) as { interpretation?: string };

      setData({
        sun_sign: sunPlanet?.sign ?? '',
        moon_sign: moonPlanet?.sign ?? '',
        rising_sign: asc.sign ?? '',
        sun_degree: sunPlanet?.degree,
        moon_degree: moonPlanet?.degree,
        asc_degree: asc.degree,
        ascendant_interpretation: ascInt.interpretation,
        midheaven_interpretation: mcInt.interpretation,
        planets,
        aspects,
        chart_pattern: interp.chart_pattern as string | undefined,
        dominant_element: interp.dominant_element as string | undefined,
        summary: interp.summary as string | undefined,
        readings: (d.readings ?? interp.readings) as WesternReadings | undefined,
        calculation_method: d.calculation_method as string | undefined,
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
      fetchWesternData();
    }
  }, [hasBirthInfo, data, dataLoading, error, fetchWesternData]);

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
            <>
              <div className={styles.grid}>
                {/* 太陽 */}
                <div className={styles.card} style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
                  <div className={styles.cardIcon}>☉</div>
                  <h2>太陽 {data.sun_sign}</h2>
                  {data.sun_degree !== undefined && <p>{data.sun_degree.toFixed(1)}°</p>}
                </div>
                {/* 月亮 */}
                <div className={styles.card} style={{ '--accent-color': '#94a3b8' } as React.CSSProperties}>
                  <div className={styles.cardIcon}>☽</div>
                  <h2>月亮 {data.moon_sign}</h2>
                  {data.moon_degree !== undefined && <p>{data.moon_degree.toFixed(1)}°</p>}
                </div>
                {/* 上升 */}
                <div className={styles.card} style={{ '--accent-color': '#ec4899' } as React.CSSProperties}>
                  <div className={styles.cardIcon}>ASC</div>
                  <h2>上升 {data.rising_sign}</h2>
                  {data.asc_degree !== undefined && <p>{data.asc_degree.toFixed(1)}°</p>}
                </div>
              </div>

              {/* 上升 / 天頂解讀 */}
              {(data.ascendant_interpretation || data.midheaven_interpretation) && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.ascendant_interpretation && (
                    <div style={{ padding: '1rem', background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px' }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#ec4899' }}>上升 ({data.rising_sign})</h4>
                      <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{data.ascendant_interpretation}</p>
                    </div>
                  )}
                  {data.midheaven_interpretation && (
                    <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px' }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#f59e0b' }}>天頂 (MC)</h4>
                      <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{data.midheaven_interpretation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 圖形 / 主導元素 */}
              {(data.chart_pattern || data.dominant_element) && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {data.chart_pattern && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>星盤圖形</div>
                      <p style={{ lineHeight: 1.5, fontSize: '0.9rem' }}>{data.chart_pattern}</p>
                    </div>
                  )}
                  {data.dominant_element && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>主導元素</div>
                      <p style={{ lineHeight: 1.5, fontSize: '0.9rem' }}>{data.dominant_element}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 整體總結 */}
              {data.summary && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>整體總結</h3>
                  <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{data.summary}</p>
                </div>
              )}

              {/* 6 段人生面向解讀 */}
              {data.readings && Object.values(data.readings).some(v => v && v.trim().length > 0) && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>詳細解讀</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {READING_LABELS.map(({ key, label }) => {
                      const text = data.readings?.[key];
                      if (!text) return null;
                      return (
                        <details key={key} open style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <summary style={{ cursor: 'pointer', fontWeight: 600, listStyle: 'none' }}>{label}</summary>
                          <p style={{ marginTop: '0.75rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{text}</p>
                        </details>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'planets' && data.planets && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.planets.map((planet, i) => (
                <details key={i} open={!!planet.interpretation} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <summary style={{ cursor: planet.interpretation ? 'pointer' : 'default', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>
                      {planet.name} {planet.retrograde && <span style={{ color: '#f87171' }}>℞</span>}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      {planet.sign} {planet.degree?.toFixed(1)}° {planet.house ? `· ${planet.house} 宮` : ''}
                    </span>
                  </summary>
                  {planet.interpretation && (
                    <p style={{ marginTop: '0.75rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{planet.interpretation}</p>
                  )}
                </details>
              ))}
            </div>
          )}

          {activeTab === 'aspects' && data.aspects && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.aspects.map((aspect, i) => (
                <details key={i} open={!!aspect.interpretation} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <summary style={{ cursor: aspect.interpretation ? 'pointer' : 'default', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>
                      <span style={{ fontWeight: 500 }}>{aspect.planet1}</span>
                      <span style={{ margin: '0 0.5rem', color: '#a78bfa' }}>{aspect.aspect}</span>
                      <span style={{ fontWeight: 500 }}>{aspect.planet2}</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>orb {aspect.orb?.toFixed(1)}°</span>
                  </summary>
                  {aspect.interpretation && (
                    <p style={{ marginTop: '0.75rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{aspect.interpretation}</p>
                  )}
                </details>
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
