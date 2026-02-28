'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateManual } from '@/lib/api';
import { CitySelector, City } from './CitySelector';
import styles from './ConsultPage.module.css';

const LOADING_PHASES = [
  '正在解讀你的出生資訊...',
  '你的性格輪廓正在浮現...',
  '快好了，最後收尾...',
];

export function ConsultPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
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
    
    // Validation
    const errors: string[] = [];
    
    if (!birthDate) {
      errors.push('請填寫出生日期');
    } else {
      // Validate date format and range
      const date = new Date(birthDate);
      const today = new Date();
      const minDate = new Date('1900-01-01');
      if (isNaN(date.getTime())) {
        errors.push('出生日期格式不正確');
      } else if (date > today) {
        errors.push('出生日期不能是未來');
      } else if (date < minDate) {
        errors.push('出生日期太早了');
      }
    }
    
    if (errors.length > 0) {
      setError(errors.join('、'));
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
          birth_place: selectedCity?.name || undefined,
          latitude: selectedCity?.latitude,
          longitude: selectedCity?.longitude,
          timezone: selectedCity?.timezone,
          gender: gender || undefined,
        },
      });
      setProgress(100);
      setTimeout(() => {
        router.push(`/manual/${result.id}`);
      }, 400);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失敗，請稍後再試');
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
            <h1>輸入出生資訊</h1>
            <p>
              我們會根據你的出生時間，寫一份專屬於你的說明書。<br/>
              資訊越完整，結果越精準。
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
                onChange={e => {
                  setBirthDate(e.target.value);
                  setError(null);
                }}
                min="1900-01-01"
                max={new Date().toISOString().split('T')[0]}
                required
                className={!birthDate && error ? styles.inputError : ''}
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
              <CitySelector
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="搜索出生城市..."
              />
              <span className={styles.hint}>選填，可提升星盤計算精準度</span>
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
              生成我的說明書
            </button>

            <p className={styles.privacy}>資料不儲存，僅用於即時分析</p>
          </form>
        </div>
      </main>
    </div>
  );
}
