'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getManual, saveManual, type UserManual, type BirthInfo } from '@/lib/api';
import { RadarChart } from './RadarChart';
import { useAuth } from './AuthContext';
import { LoginModal } from './LoginModal';
import styles from './ManualPage.module.css';

interface Props {
  manualId: string;
}

function SectionBlock({ heading, content, subPoints, id }: {
  heading: string;
  content: string;
  subPoints?: string[];
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.section} ${visible ? styles.sectionVisible : ''}`}
      data-section={id}
    >
      <h2 className={styles.sectionHeading}>{heading}</h2>
      <div className={styles.sectionContent}>
        {content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {subPoints && subPoints.length > 0 && (
        <div className={styles.subPoints}>
          {subPoints.map((point, i) => (
            <div key={i} className={styles.subPoint}>
              <span className={styles.subPointDash}>·</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ManualPage({ manualId }: Props) {
  const [manual, setManual] = useState<UserManual | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasTriedAutoSave, setHasTriedAutoSave] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const performSave = useCallback(async () => {
    if (saveStatus === 'saving' || saveStatus === 'saved') return;
    setSaveStatus('saving');
    try {
      await saveManual(manualId);  // Uses httpOnly cookie for auth
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [manualId, saveStatus]);

  // Auto-save logic: runs after manual loaded + auth state resolved
  useEffect(() => {
    if (isLoading || authLoading || hasTriedAutoSave) return;
    
    // Mark that we've tried auto-save (prevent re-triggering)
    setHasTriedAutoSave(true);
    
    if (isAuthenticated) {
      // Already logged in → auto-save
      performSave();
    } else {
      // Not logged in → show login modal for auto-save
      setShowLoginModal(true);
    }
  }, [isLoading, authLoading, isAuthenticated, hasTriedAutoSave, performSave]);

  // Handle save after successful login
  const handleLoginSuccess = useCallback(async () => {
    setShowLoginModal(false);
    
    // Give AuthContext a moment to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Save the manual
    performSave();
    
    // Also save birth info to user profile
    if (manual) {
      try {
        const birthInfo: BirthInfo = {
          birth_date: manual.birth_date,
        };
        // Extract additional birth info if available
        const deepData = manual.deep_data;
        if (deepData?.western?.has_birth_time) {
          // If we have birth time info, it's stored in the manual generation
          // We can extract it from localStorage where ConsultPage stored it
          const cachedBirthInfo = localStorage.getItem('kys_birth_info');
          if (cachedBirthInfo) {
            const cached = JSON.parse(cachedBirthInfo);
            Object.assign(birthInfo, cached);
          }
        }
        
        // Save to user profile via API
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.selfkit.art/api/v1';
        await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ birth_info: birthInfo }),
        });
      } catch (err) {
        console.error('Failed to save birth info:', err);
        // Don't show error to user - this is a background save
      }
    }
  }, [performSave, manual]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getManual(manualId);
        setManual(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入失敗');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [manualId]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: '我的使用說明書', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('已複製連結');
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingOrb} />
          <p className={styles.loadingText}>載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !manual) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <h2>找不到說明書</h2>
          <p className={styles.errorMsg}>{error || '可能已過期，請重新生成'}</p>
          <Link href="/consult" className="btn btn-primary">
            重新生成
          </Link>
        </div>
      </div>
    );
  }

  const contentSections = manual.sections.filter(s => s.id !== 'lucky');

  return (
    <div className={styles.page}>
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
        }}
        onSuccess={handleLoginSuccess}
        message="登入後自動儲存你的說明書"
      />

      {/* Background */}
      <div className={styles.meshBg}>
        <div className={styles.orbPurple} />
        <div className={styles.orbRose} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <span className={styles.headerTitle}>你的使用說明書</span>
        <button className={styles.shareBtn} onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 6a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM4.5 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM13.5 16.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM6.44 10.24l5.13 2.77M11.56 4.99L6.44 7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        {/* 1. HERO — Profile */}
        <div className={styles.profileHero}>
          <h1 className={styles.profileLabel}>{manual.profile.label}</h1>
          <p className={styles.profileTagline}>{manual.profile.tagline}</p>
        </div>

        {/* 2. SPECTRUM RADAR CHART */}
        <div className={styles.spectrumSection}>
          <p className={styles.spectrumIntro}>性格光譜</p>
          <RadarChart spectrum={manual.spectrum} />
        </div>

        {/* 3. SECTIONS — scrollable blocks */}
        <div className={styles.sectionsContainer}>
          {contentSections.map(section => (
            <SectionBlock
              key={section.id}
              id={section.id}
              heading={section.heading}
              content={section.content}
              subPoints={section.sub_points}
            />
          ))}
        </div>

        {/* 4. LUCKY GUIDE */}
        <div className={styles.luckySection}>
          <h2 className={styles.sectionHeading}>幸運符號</h2>
          <div className={styles.luckyGrid}>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>顏色</span>
              <div className={styles.luckyValue}>
                <span
                  className={styles.colorSwatch}
                  style={{ background: getLuckyColorHex(manual.lucky.color) }}
                />
                <span>{manual.lucky.color}</span>
              </div>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>數字</span>
              <span className={styles.luckyValue}>{manual.lucky.number}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>方位</span>
              <span className={styles.luckyValue}>{manual.lucky.direction}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>元素</span>
              <span className={styles.luckyValue}>{manual.lucky.element}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyLabel}>季節</span>
              <span className={styles.luckyValue}>{manual.lucky.season}</span>
            </div>
          </div>
        </div>

        {/* 5. DETAIL LINK */}
        <div className={styles.detailLink}>
          <Link href={`/manual/${manualId}/details`} className={styles.detailBtn}>
            <span>查看詳細資料</span>
            <span className={styles.detailHint}>星座命盤 · 八字 · 人類圖</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.chevronRight}>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* 6. ACTIONS */}
        <div className={styles.actions}>
          {/* Save status indicator */}
          {saveStatus !== 'idle' && (
            <div className={styles.saveStatus}>
              {saveStatus === 'saving' && '💾 儲存中...'}
              {saveStatus === 'saved' && '✓ 已儲存到你的帳號'}
              {saveStatus === 'error' && '⚠️ 儲存失敗'}
            </div>
          )}
          <button className="btn btn-primary" onClick={handleShare}>
            分享給朋友
          </button>
          <Link href="/consult" className="btn btn-ghost">
            重新生成
          </Link>
        </div>

        {/* 7. FOOTER */}
        <footer className={styles.footer}>
          僅供自我探索參考，不構成專業建議
        </footer>
      </main>
    </div>
  );
}

/** Map Chinese color names to approximate hex for the swatch */
function getLuckyColorHex(colorName: string): string {
  const map: Record<string, string> = {
    '紫色': '#7f5af0',
    '薰衣草紫': '#9b8ec4',
    '深紫': '#5b21b6',
    '藍色': '#60a5fa',
    '天空藍': '#87ceeb',
    '深藍': '#1e40af',
    '海洋藍': '#0369a1',
    '綠色': '#34d399',
    '翠綠': '#059669',
    '森林綠': '#166534',
    '橄欖綠': '#65a30d',
    '紅色': '#ef4444',
    '酒紅': '#881337',
    '珊瑚紅': '#fb7185',
    '橙色': '#fb923c',
    '金色': '#fbbf24',
    '粉色': '#f472b6',
    '玫瑰粉': '#fda4af',
    '白色': '#f5f5f4',
    '銀色': '#a8a29e',
    '灰色': '#78716c',
    '黑色': '#1c1917',
    '米色': '#d6cfc4',
    '咖啡': '#78350f',
  };
  if (map[colorName]) return map[colorName];
  for (const [key, val] of Object.entries(map)) {
    if (colorName.includes(key) || key.includes(colorName)) return val;
  }
  return '#7f5af0';
}
