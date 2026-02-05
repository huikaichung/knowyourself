'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getManual, type UserManual } from '@/lib/api';
import { RadarChart } from './RadarChart';
import styles from './ManualPage.module.css';

interface Props {
  manualId: string;
}

function SectionBlock({ heading, content, subPoints, id }: {
  heading: string;
  content: string;
  subPoints?: string[];
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.section} ${visible ? styles.sectionVisible : ''}`}
      data-section={id}
    >
      <h2 className={styles.sectionHeading}>{heading}</h2>
      <div className={styles.sectionContent}>
        {content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {subPoints && subPoints.length > 0 && (
        <div className={styles.subPoints}>
          {subPoints.map((point, i) => (
            <div key={i} className={styles.subPoint}>
              <span className={styles.subPointDash}>·</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ManualPage({ manualId }: Props) {
  const [manual, setManual] = useState<UserManual | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deepDataOpen, setDeepDataOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getManual(manualId);
        setManual(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入失敗');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [manualId]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: '我的使用說明書', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('已複製連結');
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingOrb} />
          <p className={styles.loadingText}>正在打開你的書...</p>
        </div>
      </div>
    );
  }

  if (error || !manual) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <h2>找不到這本書</h2>
          <p className={styles.errorMsg}>{error || '可能已經闔上了，再寫一本吧'}</p>
          <Link href="/consult" className="btn btn-primary">
            重新書寫
          </Link>
        </div>
      </div>
    );
  }

  const contentSections = manual.sections.filter(s => s.id !== 'lucky');

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
        <div className={styles.orbRose} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <span className={styles.headerTitle}>你的使用說明書</span>
        <button className={styles.shareBtn} onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 6a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM4.5 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM13.5 16.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM6.44 10.24l5.13 2.77M11.56 4.99L6.44 7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        {/* Book intro */}
        <div className={styles.bookIntro}>
          <p className={styles.bookIntroText}>
            這是我為你寫的。翻到任何一頁，都是關於你的。
          </p>
        </div>

        {/* 1. HERO — Profile */}
        <div className={styles.profileHero}>
          <h1 className={styles.profileLabel}>{manual.profile.label}</h1>
          <p className={styles.profileTagline}>{manual.profile.tagline}</p>
        </div>

        {/* 2. SPECTRUM RADAR CHART */}
        <div className={styles.spectrumSection}>
          <p className={styles.spectrumIntro}>你的性格光譜</p>
          <RadarChart spectrum={manual.spectrum} />
        </div>

        {/* 3. SECTIONS — scrollable blocks */}
        <div className={styles.sectionsContainer}>
          {contentSections.map(section => (
            <SectionBlock
              key={section.id}
              id={section.id}
              heading={section.heading}
              content={section.content}
              subPoints={section.sub_points}
            />
          ))}
        </div>

        {/* 4. LUCKY GUIDE */}
        <div className={styles.luckySection}>
          <h2 className={styles.sectionHeading}>屬於你的幸運符號</h2>
          <div className={styles.luckyGrid}>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>顏色</span>
              <div className={styles.luckyValue}>
                <span
                  className={styles.colorSwatch}
                  style={{ background: getLuckyColorHex(manual.lucky.color) }}
                />
                <span>{manual.lucky.color}</span>
              </div>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>數字</span>
              <span className={styles.luckyValue}>{manual.lucky.number}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>方位</span>
              <span className={styles.luckyValue}>{manual.lucky.direction}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>元素</span>
              <span className={styles.luckyValue}>{manual.lucky.element}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>季節</span>
              <span className={styles.luckyValue}>{manual.lucky.season}</span>
            </div>
          </div>
        </div>

        {/* 5. DEEP DATA — collapsible */}
        <div className={styles.deepDataSection}>
          <button
            className={styles.deepDataTrigger}
            onClick={() => setDeepDataOpen(!deepDataOpen)}
          >
            <span>底層資料</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={deepDataOpen ? styles.chevronOpen : ''}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {deepDataOpen && (
            <div className={styles.deepDataContent}>
              <div className={styles.deepDataRow}>
                <span className={styles.deepDataLabel}>星座</span>
                <span className={styles.deepDataValue}>{manual.deep_data.zodiac_name} ({manual.deep_data.zodiac_element})</span>
              </div>
              <div className={styles.deepDataRow}>
                <span className={styles.deepDataLabel}>生肖</span>
                <span className={styles.deepDataValue}>{manual.deep_data.chinese_element}{manual.deep_data.chinese_zodiac}</span>
              </div>
            </div>
          )}
        </div>

        {/* 6. ACTIONS */}
        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={handleShare}>
            把這本書分享給朋友
          </button>
          <Link href="/consult" className="btn btn-ghost">
            再寫一本
          </Link>
        </div>

        {/* 7. FOOTER */}
        <footer className={styles.footer}>
          僅供自我探索參考，不構成專業建議
        </footer>
      </main>
    </div>
  );
}

/** Map Chinese color names to approximate hex for the swatch */
function getLuckyColorHex(colorName: string): string {
  const map: Record<string, string> = {
    '紫色': '#7f5af0',
    '薰衣草紫': '#9b8ec4',
    '深紫': '#5b21b6',
    '藍色': '#60a5fa',
    '天空藍': '#87ceeb',
    '深藍': '#1e40af',
    '海洋藍': '#0369a1',
    '綠色': '#34d399',
    '翠綠': '#059669',
    '森林綠': '#166534',
    '橄欖綠': '#65a30d',
    '紅色': '#ef4444',
    '酒紅': '#881337',
    '珊瑚紅': '#fb7185',
    '橙色': '#fb923c',
    '金色': '#fbbf24',
    '粉色': '#f472b6',
    '玫瑰粉': '#fda4af',
    '白色': '#f5f5f4',
    '銀色': '#a8a29e',
    '灰色': '#78716c',
    '黑色': '#1c1917',
    '米色': '#d6cfc4',
    '咖啡': '#78350f',
  };
  if (map[colorName]) return map[colorName];
  for (const [key, val] of Object.entries(map)) {
    if (colorName.includes(key) || key.includes(colorName)) return val;
  }
  return '#7f5af0';
}
