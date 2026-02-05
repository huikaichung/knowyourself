'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HomePage.module.css';

const PERSPECTIVES = [
  { id: 'astro', emoji: '⭐', name: '占星', color: '#60A5FA' },
  { id: 'bazi', emoji: '🔥', name: '八字', color: '#FB923C' },
  { id: 'ziwei', emoji: '💜', name: '紫微', color: '#A78BFA' },
  { id: 'meihua', emoji: '🌸', name: '梅花', color: '#F472B6' },
  { id: 'humandesign', emoji: '🔺', name: '人類圖', color: '#34D399' },
];

// Generate deterministic star positions (SSR-safe, no Math.random)
const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${((i * 37 + 13) % 97)}%`,
  top: `${((i * 53 + 7) % 91)}%`,
  size: i % 3 === 0 ? 3 : 2,
  delay: `${(i * 0.47) % 5}s`,
  duration: `${3 + (i % 4)}s`,
}));

export function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.page}>
      {/* Gradient mesh background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
        <div className={styles.orbBlue} />
        <div className={styles.orbGreen} />
      </div>

      {/* Star particles */}
      <div className={styles.stars} aria-hidden="true">
        {STARS.map(star => (
          <span
            key={star.id}
            className={styles.star}
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <main className={`${styles.hero} ${loaded ? styles.visible : ''}`}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          結合命理 × 心理學的自我探索工具
        </div>

        {/* Title with gradient text */}
        <h1 className={styles.title}>
          你的
          <span className={styles.titleGradient}>使用說明書</span>
        </h1>

        <p className={styles.subtitle}>
          輸入出生資訊，從五大視角生成專屬於你的深度人格分析
        </p>

        {/* Perspective pills — glassmorphic */}
        <div className={styles.perspectives}>
          {PERSPECTIVES.map((p, i) => (
            <div
              key={p.id}
              className={styles.pill}
              style={{
                '--pill-color': p.color,
                animationDelay: `${0.3 + i * 0.1}s`,
              } as React.CSSProperties}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/consult" className={styles.cta}>
          <span className={styles.ctaText}>開始探索自己</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Trust line */}
        <p className={styles.trust}>
          ✦ 免費使用 · 無需註冊 · 資料不儲存
        </p>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        僅供自我探索參考，不構成專業建議
      </footer>
    </div>
  );
}
