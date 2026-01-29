import type { FortuneRequest, FortuneResponse, MasterBrief } from '../types/fortune';

// 優先使用環境變數，否則使用後端 Cloud Run URL
const API_URL = import.meta.env.VITE_API_URL || 'https://selfkit-backend-22akuoiitq-an.a.run.app/api/v1';

export async function consultFortune(request: FortuneRequest): Promise<FortuneResponse> {
  const response = await fetch(`${API_URL}/fortune/consult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail?.message || '占卜請求失敗');
  }

  return response.json();
}

export async function getMasters(): Promise<MasterBrief[]> {
  const response = await fetch(`${API_URL}/fortune/masters`);
  
  if (!response.ok) {
    throw new Error('無法取得大師列表');
  }

  return response.json();
}
