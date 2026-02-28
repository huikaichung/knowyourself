'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../dashboard.module.css';
import {
  questions,
  domains,
  calculateBigFiveResults,
  getDomainDescription,
  type BigFiveResult,
} from '@/lib/tests/bigfive';

export default function BigFivePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<BigFiveResult | null>(null);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const result = calculateBigFiveResults(newAnswers);
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
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/dashboard/psychology" style={{ color: 'inherit', textDecoration: 'none' }}>
            ← 返回
          </Link>
          <h1 style={{ marginTop: '1rem' }}>你的 Big Five 結果</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            基於 IPIP-NEO 60 題完整版
          </p>
        </header>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {domains.map((domain) => {
            const domainResult = results.domains[domain.code];
            const percentage = domainResult.percentage;
            
            return (
              <div
                key={domain.code}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3>{domain.name} ({domain.name_en})</h3>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{percentage}%</span>
                </div>
                
                {/* Main progress bar */}
                <div style={{
                  height: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    borderRadius: '6px',
                    transition: 'width 0.5s ease-out',
                  }} />
                </div>
                
                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {getDomainDescription(domain.code, percentage)}
                </p>

                {/* Facet breakdown */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '1rem',
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>子面向分數：</p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                  }}>
                    {domain.facets.map((facet) => {
                      const facetResult = domainResult.facets[facet.code];
                      return (
                        <div key={facet.code} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                        }}>
                          <span style={{ color: '#888', minWidth: '60px' }}>{facet.name}</span>
                          <div style={{
                            flex: 1,
                            height: '6px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${facetResult.percentage}%`,
                              background: '#3b82f6',
                              borderRadius: '3px',
                            }} />
                          </div>
                          <span style={{ color: '#666', minWidth: '30px', textAlign: 'right' }}>
                            {facetResult.percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/dashboard/psychology"
            style={{
              display: 'block',
              padding: '1rem',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
        <h1 style={{ marginTop: '1rem' }}>Big Five 人格測驗</h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>60 題完整版</p>
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
          background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
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
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
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
