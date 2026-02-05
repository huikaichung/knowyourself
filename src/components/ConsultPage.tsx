'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateManual } from '@/lib/api';
import styles from './ConsultPage.module.css';

const LOADING_PHASES = [
  '我正在翻找屬於你的那些頁面...',
  '你的故事正在一行一行浮現...',
  '快好了，最後幾筆...',
];

export function ConsultPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) return;

    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => {
        if (prev < LOADING_PHASES.length - 1) return prev + 1;
        return prev;
      });
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 85) return prev + Math.random() * 2.5;
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('請告訴我你的出生日期');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingPhase(0);
    setProgress(0);

    try {
      const result = await generateManual({
        birth_info: {
          birth_date: birthDate,
          birth_time: birthTime || undefined,
          birth_place: birthPlace || undefined,
          gender: gender || undefined,
        },
      });
      setProgress(100);
      setTimeout(() => {
        router.push(`/manual/${result.id}`);
      }, 400);
    } catch (err) {
      setError(err instanceof Error ? err.message : '寫不出來...請稍後再試');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingScreen}>
          {/* Pulsing orb */}
          <div className={styles.orbContainer}>
            <div className={styles.orb} />
            <div className={styles.orbRing} />
          </div>

          {/* Phased message */}
          <p className={styles.loadingText} key={loadingPhase}>
            {LOADING_PHASES[loadingPhase]}
          </p>

          {/* Progress bar */}
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <p className={styles.loadingHint}>大約需要 15-25 秒</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          返回
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.formHeader}>
            <h1>告訴我一件事</h1>
            <p>
              你是什麼時候來到這個世界的？<br/>
              知道得越多，我能為你寫得越準。
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.error}>{error}</div>
            )}

            {/* Birth date */}
            <div className={styles.field}>
              <label htmlFor="birthDate">
                出生日期 <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Birth time */}
            <div className={styles.field}>
              <label htmlFor="birthTime">出生時間</label>
              <input
                type="time"
                id="birthTime"
                value={birthTime}
                onChange={e => setBirthTime(e.target.value)}
              />
              <span className={styles.hint}>如果知道的話，我能看到更多</span>
            </div>

            {/* Birth place */}
            <div className={styles.field}>
              <label htmlFor="birthPlace">出生地點</label>
              <input
                type="text"
                id="birthPlace"
                value={birthPlace}
                onChange={e => setBirthPlace(e.target.value)}
                placeholder="例：台北市"
              />
            </div>

            {/* Gender */}
            <div className={styles.field}>
              <label>性別</label>
              <div className={styles.genderGroup}>
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`${styles.genderBtn} ${gender === g ? styles.genderActive : ''}`}
                    onClick={() => setGender(gender === g ? '' : g)}
                  >
                    {g === 'male' ? '男' : '女'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className={`btn btn-primary ${styles.submit}`}>
              開始為我書寫
            </button>

            <p className={styles.privacy}>你的資料不會被儲存，只在這一刻使用</p>
          </form>
        </div>
      </main>
    </div>
  );
}
