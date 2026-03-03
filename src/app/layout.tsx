import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { HeaderWrapper } from '@/components/HeaderWrapper';

export const metadata: Metadata = {
  title: '你的使用說明書',
  description: '從出生的那一刻起，你就是獨一無二的。我們幫你把那份獨特，變成看得見的文字。',
  keywords: ['人格分析', '自我認識', '使用說明書', '性格分析'],
  authors: [{ name: 'knowyourself' }],
  openGraph: {
    title: '你的使用說明書',
    description: '從出生的那一刻起，你就是獨一無二的',
    type: 'website',
    locale: 'zh_TW',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>
        <AuthProvider>
          <HeaderWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
