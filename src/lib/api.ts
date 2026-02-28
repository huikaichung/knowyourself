/**
 * API Client for knowyourself — v2
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1';

export interface BirthInfo {
  birth_date: string;
  birth_time?: string;
  birth_place?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  gender?: 'male' | 'female';
}

export interface GenerateManualRequest {
  birth_info: BirthInfo;
}

export interface SpectrumData {
  action: number;
  social: number;
  creativity: number;
  analysis: number;
  intuition: number;
  resilience: number;
}

export interface Section {
  id: string;
  heading: string;
  content: string;
  sub_points?: string[];
}

export interface LuckyGuide {
  color: string;
  number: number;
  direction: string;
  element: string;
  season: string;
}

export interface PlanetPosition {
  name: string;
  name_en?: string;
  sign: string;
  sign_en?: string;
  element?: string;
  degree?: number;
  retrograde?: boolean;
  house?: number;
}

export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
}

export interface ChartPattern {
  name: string;           // Grand Trine
  name_cn: string;        // 大三角
  planets: string[];      // [太陽, 月亮, 木星]
  element?: string;       // 水象 (for Grand Trine)
  sign?: string;          // 巨蟹座 (for Stellium)
  apex?: string;          // 頂點行星 (for T-Square)
  interpretation?: string;
}

export interface WesternAstro {
  sun_sign: string;
  sun_element: string;
  moon_sign?: string;
  rising_sign?: string;
  sun_traits?: string;
  // Enhanced precision fields
  sun_degree?: number;
  moon_degree?: number;
  asc_degree?: number;
  planets?: PlanetPosition[];
  aspects?: AspectData[];
  patterns?: ChartPattern[];   // 格局：大三角、T三角等
  calculation_method?: 'ai_estimated' | 'kerykeion_swiss_ephemeris';
  has_birth_time?: boolean;
}

export interface ZiweiPattern {
  id?: string;
  name: string;           // 紫府同宮格
  category?: string;      // 富貴格
  interpretation?: string;
  matched_stars?: string[];
}

export interface ZiweiPalace {
  name: string;           // 命宮
  branch: string;         // 子
  major_stars: string[];  // [紫微, 天府]
  minor_stars?: string[];
  sihua?: string[];       // [化祿, 化權]
}

export interface ZiweiChart {
  lunar_date?: string;    // 農曆 1990年6月15日
  year_pillar?: string;   // 庚午
  wu_xing_ju?: string;    // 土五局
  ming_gong_branch?: string;
  shen_gong_branch?: string;
  palaces?: ZiweiPalace[];
  patterns?: ZiweiPattern[];
  calculation_method?: string;
}

export interface ChineseAstro {
  zodiac: string;
  element: string;
  bazi_day_master?: string;
  bazi_summary?: string;
  ziwei?: ZiweiChart;
}

export interface HumanDesignData {
  type?: string;
  strategy?: string;
  authority?: string;
  profile?: string;
}

export interface DeepData {
  // Legacy
  zodiac_name: string;
  zodiac_element: string;
  chinese_zodiac: string;
  chinese_element: string;
  // Expanded
  western?: WesternAstro;
  chinese?: ChineseAstro;
  human_design?: HumanDesignData;
}

export interface UserManual {
  id: string;
  birth_date: string;
  generated_at: string;
  profile: {
    label: string;
    tagline: string;
  };
  spectrum: SpectrumData;
  sections: Section[];
  lucky: LuckyGuide;
  deep_data: DeepData;
}

/**
 * Generate User Manual
 */
export async function generateManual(request: GenerateManualRequest): Promise<UserManual> {
  const response = await fetch(`${API_URL}/manual/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || '生成失敗');
  }

  return response.json();
}

/**
 * Get Manual by ID
 */
export async function getManual(manualId: string): Promise<UserManual> {
  const response = await fetch(`${API_URL}/manual/${manualId}`);

  if (!response.ok) {
    throw new Error('找不到使用說明書');
  }

  return response.json();
}

export type DetailSystem = 'western' | 'ziwei' | 'bazi' | 'human_design' | 'meihua';

export interface DetailResponse {
  system: string;
  data: Record<string, unknown>;
}

/**
 * Get detailed reading for a specific system (requires auth)
 */
export async function getManualDetail(manualId: string, system: DetailSystem, accessToken?: string): Promise<DetailResponse> {
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`${API_URL}/manual/${manualId}/detail/${system}`, { headers });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('NEED_LOGIN');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || '載入失敗');
  }

  return response.json();
}

// ============================================================
// USER STORAGE
// ============================================================

/**
 * Save a manual to user's collection
 */
export async function saveManual(userId: string, manualId: string): Promise<{ success: boolean; doc_id: string }> {
  const response = await fetch(`${API_URL}/manual/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, manual_id: manualId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || '儲存失敗');
  }

  return response.json();
}

export interface SavedManualSummary {
  id: string;
  birth_date: string;
  profile: { label: string; tagline: string };
  saved_at: string;
}

/**
 * List user's saved manuals
 */
export async function listSavedManuals(userId: string): Promise<{ manuals: SavedManualSummary[] }> {
  const response = await fetch(`${API_URL}/manual/user/${userId}`);

  if (!response.ok) {
    throw new Error('載入失敗');
  }

  return response.json();
}

/**
 * Get a saved manual
 */
export async function getSavedManual(userId: string, manualId: string): Promise<UserManual> {
  const response = await fetch(`${API_URL}/manual/user/${userId}/${manualId}`);

  if (!response.ok) {
    throw new Error('找不到已儲存的說明書');
  }

  return response.json();
}

/**
 * Delete a saved manual
 */
export async function deleteSavedManual(userId: string, manualId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_URL}/manual/user/${userId}/${manualId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('刪除失敗');
  }

  return response.json();
}

// ============================================================
// CHAT API
// ============================================================

export interface ManualContext {
  label?: string;
  tagline?: string;
  zodiac?: string;
  chinese_zodiac?: string;
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  bazi_summary?: string;
  human_design_type?: string;
  human_design_strategy?: string;
  human_design_authority?: string;
}

export interface ChatRequest {
  message: string;
  manual_id?: string;
  manual_context?: ManualContext;
  conversation_id?: string;
  stream?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export interface ChatResponse {
  conversation_id: string;
  message: ChatMessage;
}

/**
 * Send a chat message (non-streaming)
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('對話失敗');
  }

  return response.json();
}

/**
 * Send a chat message with SSE streaming
 */
export async function sendChatMessageStream(
  request: ChatRequest,
  onChunk: (content: string) => void,
  onDone: (conversationId: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const response = await fetch(`${API_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('對話失敗');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('無法讀取串流');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    // Process SSE events
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'chunk') {
            onChunk(data.content);
          } else if (data.type === 'done') {
            onDone(data.conversation_id);
          } else if (data.type === 'error') {
            onError(data.content);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

/**
 * Clear chat conversation
 */
export async function clearChatConversation(conversationId: string): Promise<void> {
  await fetch(`${API_URL}/chat/${conversationId}`, {
    method: 'DELETE',
  });
}

/**
 * Extract ManualContext from UserManual
 */
export function extractManualContext(manual: UserManual): ManualContext {
  const ctx: ManualContext = {};
  
  if (manual.profile?.label) ctx.label = manual.profile.label;
  if (manual.profile?.tagline) ctx.tagline = manual.profile.tagline;
  
  if (manual.deep_data) {
    const dd = manual.deep_data;
    if (dd.zodiac_name) ctx.zodiac = dd.zodiac_name;
    if (dd.chinese_zodiac) ctx.chinese_zodiac = dd.chinese_zodiac;
    
    if (dd.western) {
      if (dd.western.sun_sign) ctx.sun_sign = dd.western.sun_sign;
      if (dd.western.moon_sign) ctx.moon_sign = dd.western.moon_sign;
      if (dd.western.rising_sign) ctx.rising_sign = dd.western.rising_sign;
    }
    
    if (dd.chinese?.bazi_summary) {
      ctx.bazi_summary = dd.chinese.bazi_summary;
    }
    
    if (dd.human_design) {
      if (dd.human_design.type) ctx.human_design_type = dd.human_design.type;
      if (dd.human_design.strategy) ctx.human_design_strategy = dd.human_design.strategy;
      if (dd.human_design.authority) ctx.human_design_authority = dd.human_design.authority;
    }
  }
  
  return ctx;
}
