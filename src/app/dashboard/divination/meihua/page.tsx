'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import { divineMeihua, type MeihuaResult } from '@/lib/api';
import styles from '../divination.module.css';

export default function MeihuaPage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<MeihuaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDivine = async () => {
    if (!question.trim()) return;

    setAnimating(true);
    setLoading(true);
    setError(null);

    try {
      // Run the casting animation in parallel with the BE call so the user
      // sees something even if the AI takes a few seconds.
      const [data] = await Promise.all([
        divineMeihua(question.trim()),
        new Promise(resolve => setTimeout(resolve, 1500)),
      ]);
      setAnimating(false);
      setResult(data);
    } catch (err) {
      setAnimating(false);
      setError(err instanceof Error ? err.message : '起卦失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const resetDivination = () => {
    setResult(null);
    setQuestion('');
    setError(null);
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>梅花易數</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
          以時間起卦，即時占卜吉凶
        </p>
      </header>

      {!result ? (
        <div className={styles.inputSection}>
          <label className={styles.label}>你想問什麼？</label>
          <textarea
            className={styles.textarea}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：這份工作適合我嗎？"
            rows={3}
          />

          <button
            className={`${styles.divineButton} ${animating ? styles.animating : ''}`}
            onClick={handleDivine}
            disabled={!question.trim() || loading}
          >
            {animating ? (
              <span className={styles.yinyang}>☯</span>
            ) : loading ? (
              'AI 解卦中...'
            ) : (
              '時間起卦'
            )}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}

          <p className={styles.hint}>
            梅花易數以當前時間為數，結合問事心念起卦
          </p>
        </div>
      ) : (
        <div className={styles.resultSection}>
          {/* 卦象展示 */}
          <div className={styles.guaDisplay}>
            <div className={styles.guaSymbol}>
              <span className={styles.upperGua}>
                {(result.primary_hexagram.upper_trigram as { symbol?: string }).symbol ?? ''}
              </span>
              <span className={styles.lowerGua}>
                {(result.primary_hexagram.lower_trigram as { symbol?: string }).symbol ?? ''}
              </span>
            </div>
            <div className={styles.guaName}>{result.primary_hexagram.name}</div>
          </div>

          {/* 三卦 */}
          <div className={styles.threeGua}>
            <div className={styles.guaCard}>
              <span className={styles.guaCardLabel}>本卦</span>
              <span className={styles.guaCardName}>{result.primary_hexagram.name}</span>
            </div>
            <div className={styles.guaCard}>
              <span className={styles.guaCardLabel}>互卦</span>
              <span className={styles.guaCardName}>{result.mutual_hexagram.name}</span>
            </div>
            <div className={styles.guaCard}>
              <span className={styles.guaCardLabel}>變卦</span>
              <span className={styles.guaCardName}>{result.transformed_hexagram.name}</span>
            </div>
          </div>

          {/* 動爻 */}
          <div className={styles.yaoCi}>
            <h3>動爻</h3>
            <p>{result.changing_line.description}（{result.changing_line.location}）</p>
          </div>

          {/* AI 解讀 */}
          <div className={styles.interpretation}>
            <h3>AI 解卦</h3>
            <p>{result.interpretation}</p>
            {result.advice && (
              <>
                <h3 style={{ marginTop: '1rem' }}>建議</h3>
                <p>{result.advice}</p>
              </>
            )}
          </div>

          {/* 問題回顧 */}
          <div className={styles.questionReview}>
            <span>問題：</span> {question}
          </div>

          <button className={styles.resetButton} onClick={resetDivination}>
            重新占卜
          </button>
        </div>
      )}
    </div>
  );
}
