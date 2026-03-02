'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../divination.module.css';

interface MeihuaResult {
  upper_gua: { name: string; symbol: string; element: string };
  lower_gua: { name: string; symbol: string; element: string };
  ben_gua: { name: string; number: number };
  hu_gua: { name: string; number: number };
  bian_gua: { name: string; number: number };
  yao_ci: string;
  interpretation: string;
  timestamp: string;
}

export default function MeihuaPage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<MeihuaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleDivine = async () => {
    if (!question.trim()) return;

    setAnimating(true);
    setLoading(true);

    // 動畫效果
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnimating(false);

    // TODO: 實際 API 呼叫
    // 暫時用模擬結果
    const mockResult: MeihuaResult = {
      upper_gua: { name: '乾', symbol: '☰', element: '金' },
      lower_gua: { name: '坤', symbol: '☷', element: '土' },
      ben_gua: { name: '天地否', number: 12 },
      hu_gua: { name: '風山漸', number: 53 },
      bian_gua: { name: '火地晉', number: 35 },
      yao_ci: '初六，拔茅茹，以其彙。貞吉，亨。',
      interpretation: '此卦顯示目前處於閉塞不通之時，但若能堅守正道，終將轉運通達。建議暫時蟄伏等待時機，不宜急進。',
      timestamp: new Date().toISOString(),
    };

    setResult(mockResult);
    setLoading(false);
  };

  const resetDivination = () => {
    setResult(null);
    setQuestion('');
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
              '起卦中...'
            ) : (
              '時間起卦'
            )}
          </button>

          <p className={styles.hint}>
            梅花易數以當前時間為數，結合問事心念起卦
          </p>
        </div>
      ) : (
        <div className={styles.resultSection}>
          {/* 卦象展示 */}
          <div className={styles.guaDisplay}>
            <div className={styles.guaSymbol}>
              <span className={styles.upperGua}>{result.upper_gua.symbol}</span>
              <span className={styles.lowerGua}>{result.lower_gua.symbol}</span>
            </div>
            <div className={styles.guaName}>{result.ben_gua.name}</div>
          </div>

          {/* 三卦 */}
          <div className={styles.threeGua}>
            <div className={styles.guaCard}>
              <span className={styles.guaCardLabel}>本卦</span>
              <span className={styles.guaCardName}>{result.ben_gua.name}</span>
            </div>
            <div className={styles.guaCard}>
              <span className={styles.guaCardLabel}>互卦</span>
              <span className={styles.guaCardName}>{result.hu_gua.name}</span>
            </div>
            <div className={styles.guaCard}>
              <span className={styles.guaCardLabel}>變卦</span>
              <span className={styles.guaCardName}>{result.bian_gua.name}</span>
            </div>
          </div>

          {/* 爻辭 */}
          <div className={styles.yaoCi}>
            <h3>爻辭</h3>
            <p>{result.yao_ci}</p>
          </div>

          {/* 解讀 */}
          <div className={styles.interpretation}>
            <h3>解讀</h3>
            <p>{result.interpretation}</p>
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
