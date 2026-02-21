'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import styles from '../../dashboard.module.css';

// Big Five 問題 - 簡化版 (每個維度 10 題)
const questions = [
  // Openness (開放性)
  { id: 1, text: '我喜歡嘗試新事物和新體驗', trait: 'O', reversed: false },
  { id: 2, text: '我對藝術和美學有濃厚興趣', trait: 'O', reversed: false },
  { id: 3, text: '我喜歡思考抽象的概念和理論', trait: 'O', reversed: false },
  { id: 4, text: '我傾向於堅持熟悉的做事方式', trait: 'O', reversed: true },
  { id: 5, text: '我有豐富的想像力', trait: 'O', reversed: false },
  
  // Conscientiousness (盡責性)
  { id: 6, text: '我做事有條理、有計畫', trait: 'C', reversed: false },
  { id: 7, text: '我會按時完成任務和承諾', trait: 'C', reversed: false },
  { id: 8, text: '我注重細節', trait: 'C', reversed: false },
  { id: 9, text: '我有時會拖延重要的事情', trait: 'C', reversed: true },
  { id: 10, text: '我對自己的工作有高標準', trait: 'C', reversed: false },
  
  // Extraversion (外向性)
  { id: 11, text: '我在社交場合感到精力充沛', trait: 'E', reversed: false },
  { id: 12, text: '我喜歡成為眾人關注的焦點', trait: 'E', reversed: false },
  { id: 13, text: '我更喜歡獨處或小團體活動', trait: 'E', reversed: true },
  { id: 14, text: '我容易與陌生人交談', trait: 'E', reversed: false },
  { id: 15, text: '我是個健談的人', trait: 'E', reversed: false },
  
  // Agreeableness (親和性)
  { id: 16, text: '我關心他人的感受', trait: 'A', reversed: false },
  { id: 17, text: '我願意幫助有需要的人', trait: 'A', reversed: false },
  { id: 18, text: '我在衝突中傾向於妥協', trait: 'A', reversed: false },
  { id: 19, text: '我有時會對他人的動機產生懷疑', trait: 'A', reversed: true },
  { id: 20, text: '我容易信任別人', trait: 'A', reversed: false },
  
  // Neuroticism (神經質)
  { id: 21, text: '我經常感到焦慮或擔憂', trait: 'N', reversed: false },
  { id: 22, text: '我的情緒容易波動', trait: 'N', reversed: false },
  { id: 23, text: '面對壓力時我能保持冷靜', trait: 'N', reversed: true },
  { id: 24, text: '我有時會感到沮喪或憂鬱', trait: 'N', reversed: false },
  { id: 25, text: '小事情有時會讓我很煩躁', trait: 'N', reversed: false },
];

const traitNames: Record<string, string> = {
  O: '開放性',
  C: '盡責性',
  E: '外向性',
  A: '親和性',
  N: '神經質',
};

const traitDescriptions: Record<string, { high: string; low: string }> = {
  O: {
    high: '你富有創造力和好奇心，喜歡探索新想法和體驗。你欣賞藝術和美學，思想開放。',
    low: '你偏好實際和傳統的方式，喜歡熟悉和穩定的環境，做事務實。',
  },
  C: {
    high: '你有條理、可靠，善於規劃和執行。你對自己有高標準，注重細節。',
    low: '你更隨性和靈活，可能不太注重計畫和細節，但更能適應變化。',
  },
  E: {
    high: '你精力充沛，喜歡社交活動。你容易與人互動，在團體中感到自在。',
    low: '你偏好獨處或小團體，在安靜的環境中更能充電。你更內斂和深思。',
  },
  A: {
    high: '你富有同理心，樂於助人。你重視和諧，容易與人合作。',
    low: '你更獨立和直接，可能更關注自己的需求和觀點。',
  },
  N: {
    high: '你對情緒較為敏感，可能較容易感到焦慮或壓力。這也意味著你對環境變化更警覺。',
    low: '你情緒穩定，面對壓力能保持冷靜。你較少被負面情緒影響。',
  },
};

export default function BigFivePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});

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
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 計算結果
      calculateResults();
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number[]> = { O: [], C: [], E: [], A: [], N: [] };
    
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        const score = q.reversed ? 6 - answer : answer;
        scores[q.trait].push(score);
      }
    });

    const finalScores: Record<string, number> = {};
    Object.keys(scores).forEach((trait) => {
      const traitScores = scores[trait];
      const avg = traitScores.reduce((a, b) => a + b, 0) / traitScores.length;
      finalScores[trait] = Math.round((avg / 5) * 100);
    });

    setResults(finalScores);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/dashboard/psychology" style={{ color: 'inherit', textDecoration: 'none' }}>
            ← 返回
          </Link>
          <h1 style={{ marginTop: '1rem' }}>你的 Big Five 結果</h1>
        </header>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {Object.entries(results).map(([trait, score]) => (
            <div
              key={trait}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3>{traitNames[trait]}</h3>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{score}%</span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}>
                <div style={{
                  height: '100%',
                  width: `${score}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  borderRadius: '4px',
                }} />
              </div>
              <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {score >= 50 ? traitDescriptions[trait].high : traitDescriptions[trait].low}
              </p>
            </div>
          ))}

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
      </header>

      {/* 進度條 */}
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
      </div>
    </div>
  );
}
