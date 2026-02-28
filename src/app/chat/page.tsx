import { Metadata } from 'next';
import { Suspense } from 'react';
import { ChatPage } from '@/components/ChatPage';

export const metadata: Metadata = {
  title: '對話 | 你的使用說明書',
  description: '與 AI 顧問對話，獲得個人化的命理與心理學洞察',
};

function ChatLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-muted)',
    }}>
      載入中...
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatPage />
    </Suspense>
  );
}
