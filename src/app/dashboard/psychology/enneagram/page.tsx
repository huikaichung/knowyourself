'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../../dashboard.module.css';
import {
  questions,
  types,
  centers,
  calculateEnneagramResults,
  getTypeDescription,
  type EnneagramResult,
} from '@/lib/tests/enneagram';

export default function EnneagramPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<EnneagramResult | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const result = calculateEnneagramResults(newAnswers);
      setResults(result);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults && results) {
    const primaryType = getTypeDescription(results.primaryType);
    const wingType = results.wing ? getTypeDescription(results.wing) : null;
    
    // Find which center this type belongs to
    const centerInfo = Object.values(centers).find(c => c.types.includes(results.primaryType));
    
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/dashboard/psychology" style={{ color: 'inherit', textDecoration: 'none' }}>
            ← 返回
          </Link>
          <h1 style={{ marginTop: '1rem' }}>你的九型人格結果</h1>
        </header>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Main type card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '0.5rem',
            }}>
              {results.primaryType}
              {results.wing && (
                <span style={{ fontSize: '1.5rem', color: '#888' }}>w{results.wing}</span>
              )}
            </div>
            <div style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
              {primaryType?.name}
            </div>
            <div style={{ fontSize: '1rem', color: '#888', marginBottom: '1rem' }}>
              {primaryType?.title}
            </div>
            <p style={{ color: '#aaa', lineHeight: 1.8 }}>
              {primaryType?.description}
            </p>
          </div>

          {/* Core motivations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>核心動機</div>
              <div style={{ fontSize: '0.9rem', color: '#f59e0b' }}>{primaryType?.coreMotivation}</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>核心恐懼</div>
              <div style={{ fontSize: '0.9rem', color: '#ef4444' }}>{primaryType?.coreFear}</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>核心渴望</div>
              <div style={{ fontSize: '0.9rem', color: '#10b981' }}>{primaryType?.coreDesire}</div>
            </div>
          </div>

          {/* Wing info */}
          {wingType && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
                你的翼型：{results.wing} - {wingType.name}
              </h3>
              <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
                翼型 {results.wing} 為你的主要類型增添了 {wingType.name} 的特質，
                讓你在 {wingType.description.slice(0, 50)}...
              </p>
            </div>
          )}

          {/* Center info */}
          {centerInfo && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
                {centerInfo.name} ({centerInfo.name_en})
              </h3>
              <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {centerInfo.description}
              </p>
              <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                核心情緒：{centerInfo.coreEmotion}
              </p>
            </div>
          )}

          {/* All type scores */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>所有類型分數</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {types.map((type) => {
                const pct = results.percentages[type.type];
                const isPrimary = type.type === results.primaryType;
                return (
                  <div key={type.type} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                    <span style={{
                      minWidth: '20px',
                      fontWeight: isPrimary ? 'bold' : 'normal',
                      color: isPrimary ? '#f59e0b' : '#888',
                    }}>
                      {type.type}
                    </span>
                    <span style={{
                      minWidth: '80px',
                      fontSize: '0.85rem',
                      color: isPrimary ? '#f59e0b' : '#666',
                    }}>
                      {type.name}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: isPrimary ? '#f59e0b' : '#666',
                        borderRadius: '4px',
                        transition: 'width 0.5s',
                      }} />
                    </div>
                    <span style={{
                      minWidth: '40px',
                      textAlign: 'right',
                      fontSize: '0.85rem',
                      color: isPrimary ? '#f59e0b' : '#666',
                    }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/dashboard/psychology"
            style={{
              display: 'block',
              padding: '1rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '0.5rem',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
              marginTop: '2rem',
            }}
          >
            完成
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard/psychology" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← 返回
        </Link>
        <h1 style={{ marginTop: '1rem' }}>九型人格測驗</h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>36 題標準版</p>
      </header>

      {/* Progress bar */}
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        marginBottom: '2rem',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          transition: 'width 0.3s',
        }} />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#888', marginBottom: '1rem' }}>
          問題 {currentQuestion + 1} / {questions.length}
        </p>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          {question.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { value: 1, label: '非常不同意' },
            { value: 2, label: '不同意' },
            { value: 3, label: '中立' },
            { value: 4, label: '同意' },
            { value: 5, label: '非常同意' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              style={{
                padding: '1rem',
                background: answers[question.id] === option.value
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {currentQuestion > 0 && (
          <button
            onClick={handlePrevious}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              color: '#888',
              cursor: 'pointer',
            }}
          >
            ← 上一題
          </button>
        )}
      </div>
    </div>
  );
}
