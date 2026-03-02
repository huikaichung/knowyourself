'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import styles from './page.module.css';

interface DataSource {
  id: string;
  name: string;
  category: 'destiny' | 'psychology';
  description: string;
  available: boolean;
  data?: Record<string, unknown>;
}

const DATA_SOURCES: Omit<DataSource, 'available' | 'data'>[] = [
  // 命盤系統
  { id: 'western', name: '西洋星盤', category: 'destiny', description: '太陽、月亮、上升與行星相位' },
  { id: 'ziwei', name: '紫微斗數', category: 'destiny', description: '命宮、十二宮與星曜' },
  { id: 'bazi', name: '八字命理', category: 'destiny', description: '四柱八字與五行分析' },
  { id: 'humandesign', name: '人類圖', category: 'destiny', description: '能量類型與人生策略' },
  { id: 'meihua', name: '梅花易數', category: 'destiny', description: '卦象與體用分析' },
  // 心理測驗
  { id: 'bigfive', name: 'Big Five 人格', category: 'psychology', description: '五大人格特質分數' },
  { id: 'mbti', name: 'MBTI 16型', category: 'psychology', description: '認知功能與類型' },
  { id: 'enneagram', name: '九型人格', category: 'psychology', description: '核心動機與翼型' },
  { id: 'attachment', name: '依附類型', category: 'psychology', description: '關係依附模式' },
];

export default function ConsultPage() {
  const { user } = useAuth();
  const [sources, setSources] = useState<DataSource[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 初始化資料來源狀態
  useEffect(() => {
    // TODO: 從 API 獲取用戶已有的資料
    const initialized = DATA_SOURCES.map((src) => ({
      ...src,
      available: ['western', 'ziwei'].includes(src.id), // 暫時假設有這兩個
      data: undefined,
    }));
    setSources(initialized);
  }, []);

  const toggleSource = (id: string) => {
    const source = sources.find((s) => s.id === id);
    if (!source?.available) return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const selectedSources = sources.filter((s) => selectedIds.has(s.id));
      
      // 構建 manual context
      const manualContext = selectedSources.length > 0 ? {
        label: selectedSources.map(s => s.name).join('、'),
      } : undefined;

      // 調用真正的 Chat API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          manual_context: manualContext,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: 'ai', content: data.message.content }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', content: '抱歉，發生錯誤，請稍後再試。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const destinySource = sources.filter((s) => s.category === 'destiny');
  const psychSource = sources.filter((s) => s.category === 'psychology');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>AI 諮詢</h1>
        <p>選擇要套用的資料，讓 AI 更了解你</p>
      </header>

      <div className={styles.layout}>
        {/* 資料選擇側欄 */}
        <aside className={styles.dataPanel}>
          <h2 className={styles.panelTitle}>套用資料</h2>
          
          <div className={styles.sourceGroup}>
            <h3 className={styles.groupTitle}>命盤系統</h3>
            {destinySource.map((src) => (
              <button
                key={src.id}
                className={`${styles.sourceItem} ${
                  selectedIds.has(src.id) ? styles.selected : ''
                } ${!src.available ? styles.disabled : ''}`}
                onClick={() => toggleSource(src.id)}
                disabled={!src.available}
              >
                <span className={styles.sourceName}>{src.name}</span>
                <span className={styles.sourceStatus}>
                  {src.available ? (selectedIds.has(src.id) ? '✓' : '') : '未解鎖'}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.sourceGroup}>
            <h3 className={styles.groupTitle}>心理測驗</h3>
            {psychSource.map((src) => (
              <button
                key={src.id}
                className={`${styles.sourceItem} ${
                  selectedIds.has(src.id) ? styles.selected : ''
                } ${!src.available ? styles.disabled : ''}`}
                onClick={() => toggleSource(src.id)}
                disabled={!src.available}
              >
                <span className={styles.sourceName}>{src.name}</span>
                <span className={styles.sourceStatus}>
                  {src.available ? (selectedIds.has(src.id) ? '✓' : '') : '未測驗'}
                </span>
              </button>
            ))}
          </div>

          <p className={styles.hint}>
            選擇越多資料，AI 的建議越精準
          </p>
        </aside>

        {/* 對話區 */}
        <main className={styles.chatArea}>
          <div className={styles.chatHistory}>
            {chatHistory.length === 0 ? (
              <div className={styles.emptyState}>
                <p>選擇資料後，開始與 AI 對話</p>
                <p className={styles.emptyHint}>
                  你可以問職涯方向、感情建議、個人成長等問題
                </p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.message} ${
                    msg.role === 'user' ? styles.userMessage : styles.aiMessage
                  }`}
                >
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div className={`${styles.message} ${styles.aiMessage} ${styles.loading}`}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.input}
              placeholder="輸入你的問題..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={loading || !message.trim()}
            >
              發送
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
