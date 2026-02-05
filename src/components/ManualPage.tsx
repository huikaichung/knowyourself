'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getManual, type UserManual } from '@/lib/api';
import styles from './ManualPage.module.css';

interface Props {
  manualId: string;
}

const CHAPTER_EMOJIS: Record<string, string> = {
  identity: '🪞',
  strengths: '⚡',
  challenges: '🌱',
  relationships: '💫',
  career: '🎯',
  energy: '🔮',
};

const SOURCE_EMOJI: Record<string, string> = {
  '占星': '⭐',
  '八字': '🔥',
  '紫微': '💜',
  '梅花': '🌸',
  '人類圖': '🔺',
  '心理學': '🧠',
};

export function ManualPage({ manualId }: Props) {
  const [manual, setManual] = useState<UserManual | null>(null);
  const [activeChapter, setActiveChapter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getManual(manualId);
        setManual(data);
        const first = Object.keys(data.chapters)[0];
        if (first) setActiveChapter(first);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入失敗');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [manualId]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>載入你的說明書...</p>
        </div>
      </div>
    );
  }

  if (error || !manual) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <p className={styles.errorIcon}>📄</p>
          <h2>找不到說明書</h2>
          <p className={styles.errorMsg}>{error || '可能已過期，請重新生成'}</p>
          <Link href="/consult" className="btn btn-primary">
            重新生成
          </Link>
        </div>
      </div>
    );
  }

  const chapters = Object.entries(manual.chapters).map(([id, ch]) => ({
    id,
    ...ch,
  }));
  const current = chapters.find(c => c.id === activeChapter);

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
        <div className={styles.orbGreen} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <span className={styles.headerTitle}>你的使用說明書</span>
        <button
          className={styles.shareBtn}
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: '我的使用說明書', url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('已複製連結！');
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 6a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM4.5 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM13.5 16.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM6.44 10.24l5.13 2.77M11.56 4.99L6.44 7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        {/* Profile card with gradient border */}
        <div className={styles.profileCardWrapper}>
          <div className={styles.profileCard}>
            <div className={styles.profileLabel}>{manual.profile.core_label}</div>
            <p className={styles.profileLiner}>「{manual.profile.one_liner}」</p>
          </div>
        </div>

        {/* Chapter tabs — horizontal scroll with active indicator line */}
        <nav className={styles.tabs}>
          {chapters.map(ch => (
            <button
              key={ch.id}
              className={`${styles.tab} ${activeChapter === ch.id ? styles.tabActive : ''}`}
              onClick={() => setActiveChapter(ch.id)}
            >
              <span className={styles.tabEmoji}>{CHAPTER_EMOJIS[ch.id] || '📖'}</span>
              <span className={styles.tabLabel}>{ch.title}</span>
              {activeChapter === ch.id && <span className={styles.tabIndicator} />}
            </button>
          ))}
        </nav>

        {/* Chapter content */}
        {current && (
          <div className={styles.chapter} key={current.id}>
            <p className={styles.chapterSummary}>{current.summary}</p>

            <div className={styles.insights}>
              {current.points?.map((point: any, i: number) => (
                <div
                  key={i}
                  className={styles.insightCard}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <h4 className={styles.insightTitle}>{point.insight}</h4>
                  <p className={styles.insightText}>{point.explanation}</p>

                  {(point.psychology_perspective || point.psychology) && (
                    <div className={styles.psychBox}>
                      <span className={styles.psychLabel}>🧠 心理學</span>
                      <p>{point.psychology_perspective || point.psychology}</p>
                    </div>
                  )}

                  <div className={styles.sources}>
                    {point.sources?.map((s: string) => (
                      <span key={s} className={`tag tag-${s}`}>
                        {SOURCE_EMOJI[s] || '•'} {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regenerate CTA */}
        <div className={styles.bottomCta}>
          <Link href="/consult" className="btn btn-ghost">
            🔄 重新生成
          </Link>
        </div>
      </main>
    </div>
  );
}
