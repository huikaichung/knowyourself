'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import styles from './HomePage.module.css';

const CHAPTERS = [
  { title: '你的核心本質', desc: '你最真實的樣子，連你自己都未必看清' },
  { title: '隱藏的天賦', desc: '你身上那些被忽略的光芒' },
  { title: '感情中的你', desc: '你怎麼愛人，又需要怎樣被愛' },
  { title: '職業天賦', desc: '你天生適合做什麼' },
  { title: '成長的方向', desc: '如果你願意，下一步可以往哪走' },
  { title: '今年的你', desc: '2026 年，屬於你的主旋律' },
];

export function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const { isAuthenticated, hasBirthInfo, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Logged in + already has birth info → skip the intro and go straight to the dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && hasBirthInfo) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, hasBirthInfo, router]);

  // Render nothing during the redirect to avoid a flash of the marketing copy
  if (!loading && isAuthenticated && hasBirthInfo) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Soft background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
        <div className={styles.orbRose} />
      </div>

      <main className={`${styles.hero} ${loaded ? styles.visible : ''}`}>
        {/* Title */}
        <h1 className={styles.title}>你的使用說明書</h1>

        <div className={styles.bookVoice}>
          <p className={styles.subtitle}>
            從出生那一刻起，你就是獨一無二的。
          </p>
          <p className={styles.subtitleSecond}>
            這份說明書，把那份獨特寫成看得見的文字。
          </p>
        </div>

        {/* Chapters preview */}
        <div className={styles.chapters}>
          <p className={styles.chaptersIntro}>你會讀到</p>
          <div className={styles.chaptersList}>
            {CHAPTERS.map((item, i) => (
              <div
                key={item.title}
                className={styles.chapterItem}
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
              >
                <span className={styles.chapterDot}>·</span>
                <div className={styles.chapterText}>
                  <span className={styles.chapterTitle}>{item.title}</span>
                  <span className={styles.chapterSep}> — </span>
                  <span className={styles.chapterDesc}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href="/consult" className={styles.cta}>
          開始認識自己
        </Link>

        {/* Trust line - different text based on auth state */}
        <p className={styles.trust}>
          {isAuthenticated 
            ? '免費 · 登入後可儲存說明書'
            : '免費 · 無需註冊即可體驗'
          }
        </p>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        僅供自我探索參考，不構成專業建議
      </footer>
    </div>
  );
}
