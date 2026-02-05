'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateManual } from '@/lib/api';
import styles from './ConsultPage.module.css';

const PERSPECTIVES = [
  { id: 'astro', emoji: '⭐', name: '占星' },
  { id: 'bazi', emoji: '🔥', name: '八字' },
  { id: 'ziwei', emoji: '💜', name: '紫微' },
  { id: 'meihua', emoji: '🌸', name: '梅花' },
  { id: 'humandesign', emoji: '🔺', name: '人類圖' },
];

const LOADING_MESSAGES = [
  '正在解讀星象能量...',
  '分析八字五行分佈...',
  '計算紫微命盤格局...',
  '融合心理學視角...',
  '生成你的使用說明書...',
];

export function ConsultPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [perspectives, setPerspectives] = useState(
    PERSPECTIVES.map(p => ({ ...p, checked: true }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setPerspectives(prev =>
      prev.map(p => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('請填寫出生日期');
      return;
    }

    const selected = perspectives.filter(p => p.checked);
    if (selected.length === 0) {
      setError('請至少選擇一個視角');
      return;
    }

    setError(null);
    setIsLoading(true);

    let idx = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 2500);

    try {
      const result = await generateManual({
        birth_info: {
          birth_date: birthDate,
          birth_time: birthTime || undefined,
          birth_place: birthPlace || undefined,
          gender: gender || undefined,
        },
        perspectives: selected.map(p => p.id),
      });
      clearInterval(interval);
      router.push(`/manual/${result.id}`);
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : '生成失敗，請稍後再試');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.meshBg}>
          <div className={styles.orbPurple} />
        </div>
        <div className={styles.loadingScreen}>
          {/* Orbital animation */}
          <div className={styles.orbitalContainer}>
            <div className={styles.orbitalCenter} />
            <span className={`${styles.orbiter} ${styles.orbiter1}`} />
            <span className={`${styles.orbiter} ${styles.orbiter2}`} />
            <span className={`${styles.orbiter} ${styles.orbiter3}`} />
          </div>
          <p className={styles.loadingText}>{loadingMsg}</p>
          <p className={styles.loadingHint}>通常需要 10-20 秒</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Background mesh */}
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
        {/* Glassmorphic card */}
        <div className={styles.card}>
          <div className={styles.formHeader}>
            <h1>輸入出生資訊</h1>
            <p>我們會根據你的資訊，從多個視角生成個人化分析</p>
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
              <span className={styles.hint}>選填，可提升分析精準度</span>
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
                    {g === 'male' ? '♂ 男' : '♀ 女'}
                  </button>
                ))}
              </div>
            </div>

            {/* Perspectives */}
            <div className={styles.field}>
              <label>分析視角</label>
              <div className={styles.perspectiveGrid}>
                {perspectives.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.perspectiveChip} ${p.checked ? styles.perspectiveActive : ''}`}
                    onClick={() => handleToggle(p.id)}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className={`btn btn-primary ${styles.submit}`}>
              ✨ 生成我的使用說明書
            </button>

            <p className={styles.privacy}>🔒 資料不儲存，僅用於即時分析</p>
          </form>
        </div>
      </main>
    </div>
  );
}
