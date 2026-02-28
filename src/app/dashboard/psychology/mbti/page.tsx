'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../../dashboard.module.css';
import {
  questions,
  dimensions,
  calculateMBTIResults,
  typeDescriptions,
  type MBTIResult,
} from '@/lib/tests/mbti';

export default function MBTIPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<MBTIResult | null>(null);

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
      const result = calculateMBTIResults(newAnswers);
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
    const typeInfo = typeDescriptions[results.type];
    
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/dashboard/psychology" style={{ color: 'inherit', textDecoration: 'none' }}>
            ← 返回
          </Link>
          <h1 style={{ marginTop: '1rem' }}>你的 MBTI 類型</h1>
        </header>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Main type card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '0.5rem',
            }}>
              {results.type}
            </div>
            <div style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem' }}>
              {typeInfo?.title || ''}
            </div>
            <p style={{ color: '#888', lineHeight: 1.8 }}>
              {typeInfo?.description || ''}
            </p>
          </div>

          {/* Dimension breakdowns */}
          <div style={{
            display: 'grid',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {dimensions.map((dim) => {
              const dimResult = results.dimensions[dim.code as keyof typeof results.dimensions];
              const pole1 = dim.poles[0];
              const pole2 = dim.poles[1];
              const pole1Score = dimResult[pole1.code as keyof typeof dimResult] as number;
              const pole2Score = dimResult[pole2.code as keyof typeof dimResult] as number;
              const total = pole1Score + pole2Score || 1;
              const pole1Pct = Math.round((pole1Score / total) * 100);
              const pole2Pct = 100 - pole1Pct;
              
              return (
                <div key={dim.code} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                }}>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                  }}>
                    {dim.name}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <div style={{
                      flex: 1,
                      textAlign: 'right',
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: dimResult.dominant === pole1.code ? 'bold' : 'normal',
                        color: dimResult.dominant === pole1.code ? '#10b981' : '#888',
                      }}>
                        {pole1.code} ({pole1Pct}%)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {pole1.name.split(' ')[0]}
                      </div>
                    </div>
                    
                    <div style={{
                      width: '150px',
                      height: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                    }}>
                      <div style={{
                        width: `${pole1Pct}%`,
                        height: '100%',
                        background: dimResult.dominant === pole1.code ? '#10b981' : '#666',
                      }} />
                      <div style={{
                        width: `${pole2Pct}%`,
                        height: '100%',
                        background: dimResult.dominant === pole2.code ? '#10b981' : '#666',
                      }} />
                    </div>
                    
                    <div style={{
                      flex: 1,
                      textAlign: 'left',
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: dimResult.dominant === pole2.code ? 'bold' : 'normal',
                        color: dimResult.dominant === pole2.code ? '#10b981' : '#888',
                      }}>
                        {pole2.code} ({pole2Pct}%)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {pole2.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dimension descriptions */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>各維度說明</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {dimensions.map((dim) => {
                const dimResult = results.dimensions[dim.code as keyof typeof results.dimensions];
                const dominantPole = dim.poles.find(p => p.code === dimResult.dominant);
                return (
                  <div key={dim.code} style={{ fontSize: '0.9rem', color: '#888' }}>
                    <strong style={{ color: '#10b981' }}>{dominantPole?.name}</strong>
                    {': '}
                    {dominantPole?.description}
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
              background: 'linear-gradient(135deg, #10b981, #059669)',
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
        <h1 style={{ marginTop: '1rem' }}>MBTI 16型人格測驗</h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>70 題認知功能版</p>
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
          background: 'linear-gradient(90deg, #10b981, #34d399)',
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
                  ? 'linear-gradient(135deg, #10b981, #059669)'
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
