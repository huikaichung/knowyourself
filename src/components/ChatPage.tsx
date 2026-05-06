'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  sendChatMessageStream,
  getManual,
  extractManualContext,
  ManualContext,
  UserManual,
} from '@/lib/api';
import styles from './ChatPage.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '你好！👋 我是你的 AI 顧問。可以和我聊聊你的困惑、選擇、或任何想探索的事。我會結合命理與心理學的視角，給你一些不一樣的洞察。',
};

const SUGGESTIONS = [
  '最近工作上有點迷茫...',
  '我的人際關係如何改善？',
  '我適合什麼樣的工作？',
  '幫我分析一下我的性格',
];

export function ChatPage() {
  const searchParams = useSearchParams();
  const manualId = searchParams.get('manual');
  
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [manualContext, setManualContext] = useState<ManualContext | null>(null);
  const [manual, setManual] = useState<UserManual | null>(null);
  const [loadingManual, setLoadingManual] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load manual context if manualId provided
  useEffect(() => {
    async function loadManual() {
      if (!manualId) return;
      
      setLoadingManual(true);
      try {
        const m = await getManual(manualId);
        setManual(m);
        setManualContext(extractManualContext(m));
        
        // Update welcome message with personalized greeting
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `你好！👋 我已經看過你的說明書了。${m.profile?.label ? `你是「${m.profile.label}」類型` : ''}，我們來聊聊吧！有什麼想探索的嗎？`,
        }]);
      } catch {
        // Silently fail - just use generic welcome
      } finally {
        setLoadingManual(false);
      }
    }
    loadManual();
  }, [manualId]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // BE is stateless - send recent history so the model has context.
      const history = messages
        .filter(m => m.id !== WELCOME_MESSAGE.id && !m.isStreaming)
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      await sendChatMessageStream(
        {
          message: text.trim(),
          history,
          manual_context: manualContext || undefined,
          manual_id: manualId || undefined,
        },
        // onChunk
        (chunk) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.content += chunk;
            }
            return updated;
          });
        },
        // onDone
        () => {
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.isStreaming = false;
            }
            return updated;
          });
        },
        // onError
        (error) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.content = error;
              lastMsg.isStreaming = false;
            }
            return updated;
          });
        }
      );
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.content = '抱歉，發生了一些問題。請稍後再試 🙏';
          lastMsg.isStreaming = false;
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          返回
        </Link>
        <div className={styles.headerCenter}>
          <div className={styles.headerTitle}>AI 顧問</div>
          {manualContext && (
            <div className={styles.headerSubtitle}>
              已載入你的命盤資料
            </div>
          )}
        </div>
        <div className={styles.headerRight}>
          {manual && (
            <Link href={`/manual/${manualId}`} className={styles.manualLink}>
              查看說明書
            </Link>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className={styles.main}>
        <div className={styles.messagesContainer}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              {msg.role === 'assistant' && (
                <div className={styles.avatar}>✨</div>
              )}
              <div className={styles.bubble}>
                {msg.content}
                {msg.isStreaming && <span className={styles.cursor}>▊</span>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions - show only at start */}
        {messages.length === 1 && !isLoading && (
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className={styles.suggestionBtn}
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Input */}
      <footer className={styles.footer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="輸入訊息..."
            className={styles.input}
            rows={1}
            disabled={isLoading || loadingManual}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim() || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <p className={styles.disclaimer}>
          AI 僅供參考，不構成專業建議
        </p>
      </footer>
    </div>
  );
}
