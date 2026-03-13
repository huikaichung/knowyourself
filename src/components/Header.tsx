'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './AuthContext';
import { LoginModal } from './LoginModal';
import styles from './Header.module.css';

export function Header() {
  const { user, isAuthenticated, loading, logout, refreshUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          你的使用說明書
        </Link>

        <div className={styles.right}>
          {loading ? (
            <div className={styles.loading} />
          ) : isAuthenticated && user ? (
            <div className={styles.userArea}>
              <button 
                className={styles.avatar}
                onClick={() => setShowMenu(!showMenu)}
                aria-label="用戶選單"
              >
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || '用戶'}
                    width={36}
                    height={36}
                    className={styles.avatarImg}
                  />
                ) : (
                  <span className={styles.avatarFallback}>
                    {user.name?.[0] || user.email?.[0] || '?'}
                  </span>
                )}
              </button>

              {showMenu && (
                <>
                  <div 
                    className={styles.menuBackdrop} 
                    onClick={() => setShowMenu(false)} 
                  />
                  <div className={styles.menu}>
                    <div className={styles.menuHeader}>
                      <p className={styles.menuName}>{user.name || '用戶'}</p>
                      <p className={styles.menuEmail}>{user.email}</p>
                    </div>
                    <div className={styles.menuDivider} />
                    <Link 
                      href="/dashboard" 
                      className={styles.menuItem}
                      onClick={() => setShowMenu(false)}
                    >
                      📊 我的面板
                    </Link>
                    <Link 
                      href="/dashboard/settings" 
                      className={styles.menuItem}
                      onClick={() => setShowMenu(false)}
                    >
                      ⚙️ 個人設定
                    </Link>
                    <div className={styles.menuDivider} />
                    <button 
                      className={styles.menuItem}
                      onClick={handleLogout}
                    >
                      🚪 登出
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              className={styles.loginBtn}
              onClick={() => setShowLoginModal(true)}
            >
              登入
            </button>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          refreshUser();
          setShowLoginModal(false);
        }}
      />
    </>
  );
}
