'use client';

import Link from 'next/link';
import styles from './ChatPage.module.css';

// Deterministic star positions for the chat page
const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${((i * 41 + 11) % 95)}%`,
  top: `${((i * 59 + 3) % 89)}%`,
  size: i % 3 === 0 ? 3 : 2,
  delay: `${(i * 0.53) % 5}s`,
  duration: `${3 + (i % 3)}s`,
}));

export function ChatPage() {
  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
      </div>

      {/* Stars */}
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

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>💬</span>
        </div>
        <h2 className={styles.title}>AI 顧問</h2>
        <div className={styles.badge}>即將推出</div>
        <p className={styles.description}>
          對話功能正在開發中，結合你的使用說明書獲得個人化建議
        </p>
        <Link href="/" className="btn btn-ghost">
          ← 返回首頁
        </Link>
      </div>
    </div>
  );
}
