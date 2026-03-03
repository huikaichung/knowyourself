'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

// 不顯示 Header 的路徑
const EXCLUDED_PATHS = [
  '/dashboard',
  '/login',
];

export function HeaderWrapper() {
  const pathname = usePathname();
  
  // 檢查是否應該隱藏 Header
  const shouldHide = EXCLUDED_PATHS.some(path => pathname.startsWith(path));
  
  if (shouldHide) {
    return null;
  }
  
  return <Header />;
}
