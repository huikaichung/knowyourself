/**
 * Big Five Personality Test - IPIP-NEO 60-item version
 * 
 * Based on: International Personality Item Pool (IPIP)
 * Reference: https://ipip.ori.org/
 * 
 * Structure:
 * - 5 domains (OCEAN): Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
 * - 6 facets per domain
 * - 2 items per facet = 60 items total
 * 
 * Scoring: 5-point Likert scale (1=Strongly Disagree to 5=Strongly Agree)
 * Reversed items are scored as (6 - response)
 */

export interface BigFiveQuestion {
  id: number;
  text: string;
  text_en: string;
  domain: 'O' | 'C' | 'E' | 'A' | 'N';
  facet: string;
  reversed: boolean;
}

export interface BigFiveDomain {
  code: 'O' | 'C' | 'E' | 'A' | 'N';
  name: string;
  name_en: string;
  description: string;
  facets: {
    code: string;
    name: string;
    name_en: string;
  }[];
}

export const domains: BigFiveDomain[] = [
  {
    code: 'N',
    name: '神經質',
    name_en: 'Neuroticism',
    description: '體驗負面情緒的傾向，包括焦慮、憤怒、抑鬱等',
    facets: [
      { code: 'N1', name: '焦慮', name_en: 'Anxiety' },
      { code: 'N2', name: '憤怒', name_en: 'Anger' },
      { code: 'N3', name: '抑鬱', name_en: 'Depression' },
      { code: 'N4', name: '自我意識', name_en: 'Self-Consciousness' },
      { code: 'N5', name: '缺乏節制', name_en: 'Immoderation' },
      { code: 'N6', name: '脆弱', name_en: 'Vulnerability' },
    ],
  },
  {
    code: 'E',
    name: '外向性',
    name_en: 'Extraversion',
    description: '從社交互動中獲取能量的傾向',
    facets: [
      { code: 'E1', name: '友善', name_en: 'Friendliness' },
      { code: 'E2', name: '合群', name_en: 'Gregariousness' },
      { code: 'E3', name: '果斷', name_en: 'Assertiveness' },
      { code: 'E4', name: '活躍', name_en: 'Activity Level' },
      { code: 'E5', name: '尋求刺激', name_en: 'Excitement-Seeking' },
      { code: 'E6', name: '樂觀', name_en: 'Cheerfulness' },
    ],
  },
  {
    code: 'O',
    name: '開放性',
    name_en: 'Openness to Experience',
    description: '對新體驗、創意和抽象思維的開放程度',
    facets: [
      { code: 'O1', name: '想像力', name_en: 'Imagination' },
      { code: 'O2', name: '藝術興趣', name_en: 'Artistic Interests' },
      { code: 'O3', name: '情感深度', name_en: 'Emotionality' },
      { code: 'O4', name: '冒險精神', name_en: 'Adventurousness' },
      { code: 'O5', name: '智識好奇', name_en: 'Intellect' },
      { code: 'O6', name: '開明', name_en: 'Liberalism' },
    ],
  },
  {
    code: 'A',
    name: '親和性',
    name_en: 'Agreeableness',
    description: '與他人和諧相處、關心他人的傾向',
    facets: [
      { code: 'A1', name: '信任', name_en: 'Trust' },
      { code: 'A2', name: '道德感', name_en: 'Morality' },
      { code: 'A3', name: '利他', name_en: 'Altruism' },
      { code: 'A4', name: '合作', name_en: 'Cooperation' },
      { code: 'A5', name: '謙遜', name_en: 'Modesty' },
      { code: 'A6', name: '同情心', name_en: 'Sympathy' },
    ],
  },
  {
    code: 'C',
    name: '盡責性',
    name_en: 'Conscientiousness',
    description: '自律、有條理、追求目標的傾向',
    facets: [
      { code: 'C1', name: '自我效能', name_en: 'Self-Efficacy' },
      { code: 'C2', name: '秩序', name_en: 'Orderliness' },
      { code: 'C3', name: '責任感', name_en: 'Dutifulness' },
      { code: 'C4', name: '追求成就', name_en: 'Achievement-Striving' },
      { code: 'C5', name: '自律', name_en: 'Self-Discipline' },
      { code: 'C6', name: '謹慎', name_en: 'Cautiousness' },
    ],
  },
];

// Questions based on IPIP-NEO, reworded for our context
// Each facet has 2 items (1 positive, 1 negative/reversed)
export const questions: BigFiveQuestion[] = [
  // ==================== NEUROTICISM (N) ====================
  // N1: Anxiety
  { id: 1, text: '我容易為各種事情感到擔憂', text_en: 'I worry about many things', domain: 'N', facet: 'N1', reversed: false },
  { id: 2, text: '即使在壓力下，我通常也能保持平靜', text_en: 'I remain calm even under pressure', domain: 'N', facet: 'N1', reversed: true },
  
  // N2: Anger
  { id: 3, text: '我很容易被惹怒', text_en: 'I get irritated easily', domain: 'N', facet: 'N2', reversed: false },
  { id: 4, text: '我很少對人發脾氣', text_en: 'I seldom get mad at others', domain: 'N', facet: 'N2', reversed: true },
  
  // N3: Depression
  { id: 5, text: '我經常感到情緒低落', text_en: 'I often feel blue or down', domain: 'N', facet: 'N3', reversed: false },
  { id: 6, text: '我對自己感到滿意', text_en: 'I feel comfortable with myself', domain: 'N', facet: 'N3', reversed: true },
  
  // N4: Self-Consciousness
  { id: 7, text: '在社交場合我容易感到不自在', text_en: 'I feel uncomfortable in social situations', domain: 'N', facet: 'N4', reversed: false },
  { id: 8, text: '我不太容易感到尷尬', text_en: 'I am not easily embarrassed', domain: 'N', facet: 'N4', reversed: true },
  
  // N5: Immoderation
  { id: 9, text: '我有時會做出事後後悔的事', text_en: 'I do things I later regret', domain: 'N', facet: 'N5', reversed: false },
  { id: 10, text: '我能很好地抵抗誘惑', text_en: 'I easily resist temptations', domain: 'N', facet: 'N5', reversed: true },
  
  // N6: Vulnerability
  { id: 11, text: '面對困難時我容易感到不知所措', text_en: 'I become overwhelmed when facing difficulties', domain: 'N', facet: 'N6', reversed: false },
  { id: 12, text: '我知道如何應對生活中的挫折', text_en: 'I know how to cope with setbacks', domain: 'N', facet: 'N6', reversed: true },
  
  // ==================== EXTRAVERSION (E) ====================
  // E1: Friendliness
  { id: 13, text: '我很容易與新認識的人建立友誼', text_en: 'I make friends easily', domain: 'E', facet: 'E1', reversed: false },
  { id: 14, text: '我需要很長時間才能讓別人了解我', text_en: 'I am hard to get to know', domain: 'E', facet: 'E1', reversed: true },
  
  // E2: Gregariousness
  { id: 15, text: '我喜歡參加熱鬧的聚會', text_en: 'I love attending lively parties', domain: 'E', facet: 'E2', reversed: false },
  { id: 16, text: '我更喜歡獨處而不是參加社交活動', text_en: 'I prefer being alone to attending social events', domain: 'E', facet: 'E2', reversed: true },
  
  // E3: Assertiveness
  { id: 17, text: '在團體中我會主動帶領方向', text_en: 'I take charge in group situations', domain: 'E', facet: 'E3', reversed: false },
  { id: 18, text: '我傾向於等待別人做決定', text_en: 'I wait for others to lead the way', domain: 'E', facet: 'E3', reversed: true },
  
  // E4: Activity Level
  { id: 19, text: '我總是忙個不停，行程排得很滿', text_en: 'I am always busy and on the go', domain: 'E', facet: 'E4', reversed: false },
  { id: 20, text: '我喜歡悠閒放鬆的生活節奏', text_en: 'I like a leisurely lifestyle', domain: 'E', facet: 'E4', reversed: true },
  
  // E5: Excitement-Seeking
  { id: 21, text: '我喜歡刺激和冒險的活動', text_en: 'I love excitement and adventure', domain: 'E', facet: 'E5', reversed: false },
  { id: 22, text: '我不喜歡過於喧鬧或刺激的環境', text_en: 'I dislike loud or overly stimulating environments', domain: 'E', facet: 'E5', reversed: true },
  
  // E6: Cheerfulness
  { id: 23, text: '我總是看到事情光明的一面', text_en: 'I always look at the bright side of things', domain: 'E', facet: 'E6', reversed: false },
  { id: 24, text: '我不太容易被事情逗樂', text_en: 'I am not easily amused', domain: 'E', facet: 'E6', reversed: true },
  
  // ==================== OPENNESS (O) ====================
  // O1: Imagination
  { id: 25, text: '我有豐富的想像力和內心世界', text_en: 'I have a vivid imagination', domain: 'O', facet: 'O1', reversed: false },
  { id: 26, text: '我很少沉浸在白日夢中', text_en: 'I seldom daydream', domain: 'O', facet: 'O1', reversed: true },
  
  // O2: Artistic Interests
  { id: 27, text: '我欣賞藝術和美的事物', text_en: 'I appreciate art and beauty', domain: 'O', facet: 'O2', reversed: false },
  { id: 28, text: '我對詩歌或藝術展覽沒什麼興趣', text_en: 'I have little interest in poetry or art exhibitions', domain: 'O', facet: 'O2', reversed: true },
  
  // O3: Emotionality
  { id: 29, text: '我能強烈地感受自己的情緒', text_en: 'I experience my emotions intensely', domain: 'O', facet: 'O3', reversed: false },
  { id: 30, text: '我很少注意到自己的情緒反應', text_en: 'I rarely notice my emotional reactions', domain: 'O', facet: 'O3', reversed: true },
  
  // O4: Adventurousness
  { id: 31, text: '我喜歡嘗試新事物和新體驗', text_en: 'I enjoy trying new things and experiences', domain: 'O', facet: 'O4', reversed: false },
  { id: 32, text: '我傾向於堅持已知的熟悉方式', text_en: 'I prefer to stick with familiar ways', domain: 'O', facet: 'O4', reversed: true },
  
  // O5: Intellect
  { id: 33, text: '我喜歡探討深奧的理論問題', text_en: 'I enjoy discussing abstract ideas', domain: 'O', facet: 'O5', reversed: false },
  { id: 34, text: '我對抽象的概念不太感興趣', text_en: 'I am not interested in abstract concepts', domain: 'O', facet: 'O5', reversed: true },
  
  // O6: Liberalism (reworded to avoid political bias)
  { id: 35, text: '我認為應該接納多元的價值觀', text_en: 'I believe in accepting diverse values', domain: 'O', facet: 'O6', reversed: false },
  { id: 36, text: '我認為傳統的規範應該被嚴格遵守', text_en: 'I believe traditional norms should be strictly followed', domain: 'O', facet: 'O6', reversed: true },
  
  // ==================== AGREEABLENESS (A) ====================
  // A1: Trust
  { id: 37, text: '我相信大多數人是善意的', text_en: 'I believe most people have good intentions', domain: 'A', facet: 'A1', reversed: false },
  { id: 38, text: '我對他人的動機常常抱持懷疑', text_en: 'I suspect hidden motives in others', domain: 'A', facet: 'A1', reversed: true },
  
  // A2: Morality
  { id: 39, text: '我會堅持遵守規則，即使沒人在看', text_en: 'I stick to the rules even when no one is watching', domain: 'A', facet: 'A2', reversed: false },
  { id: 40, text: '為了達到目的，我有時會走捷徑', text_en: 'I sometimes take shortcuts to get what I want', domain: 'A', facet: 'A2', reversed: true },
  
  // A3: Altruism
  { id: 41, text: '我喜歡幫助有需要的人', text_en: 'I love to help others in need', domain: 'A', facet: 'A3', reversed: false },
  { id: 42, text: '我對別人的問題不太感興趣', text_en: 'I am indifferent to other people\'s problems', domain: 'A', facet: 'A3', reversed: true },
  
  // A4: Cooperation
  { id: 43, text: '我傾向於避免衝突和對抗', text_en: 'I try to avoid confrontations', domain: 'A', facet: 'A4', reversed: false },
  { id: 44, text: '我喜歡辯論，即使可能引起爭執', text_en: 'I enjoy debates even if they might cause arguments', domain: 'A', facet: 'A4', reversed: true },
  
  // A5: Modesty
  { id: 45, text: '我不喜歡誇耀自己的成就', text_en: 'I dislike boasting about my achievements', domain: 'A', facet: 'A5', reversed: false },
  { id: 46, text: '我認為自己比大多數人優秀', text_en: 'I believe I am better than most people', domain: 'A', facet: 'A5', reversed: true },
  
  // A6: Sympathy
  { id: 47, text: '看到他人受苦，我會感同身受', text_en: 'I feel others\' pain when they suffer', domain: 'A', facet: 'A6', reversed: false },
  { id: 48, text: '我覺得人應該自己解決自己的問題', text_en: 'I believe people should fend for themselves', domain: 'A', facet: 'A6', reversed: true },
  
  // ==================== CONSCIENTIOUSNESS (C) ====================
  // C1: Self-Efficacy
  { id: 49, text: '我相信自己有能力完成任務', text_en: 'I am confident in my ability to complete tasks', domain: 'C', facet: 'C1', reversed: false },
  { id: 50, text: '我常常覺得自己沒什麼可貢獻的', text_en: 'I often feel I have little to contribute', domain: 'C', facet: 'C1', reversed: true },
  
  // C2: Orderliness
  { id: 51, text: '我喜歡保持環境整齊有序', text_en: 'I like to keep things tidy and organized', domain: 'C', facet: 'C2', reversed: false },
  { id: 52, text: '我的東西常常亂放', text_en: 'I often leave my belongings around', domain: 'C', facet: 'C2', reversed: true },
  
  // C3: Dutifulness
  { id: 53, text: '我會信守承諾', text_en: 'I keep my promises', domain: 'C', facet: 'C3', reversed: false },
  { id: 54, text: '我有時會違背自己說過的話', text_en: 'I sometimes break my word', domain: 'C', facet: 'C3', reversed: true },
  
  // C4: Achievement-Striving
  { id: 55, text: '我對自己有很高的標準', text_en: 'I set high standards for myself', domain: 'C', facet: 'C4', reversed: false },
  { id: 56, text: '我做事只求剛好過關就好', text_en: 'I do just enough to get by', domain: 'C', facet: 'C4', reversed: true },
  
  // C5: Self-Discipline
  { id: 57, text: '我會立即著手處理待辦事項', text_en: 'I get chores done right away', domain: 'C', facet: 'C5', reversed: false },
  { id: 58, text: '我常常拖延工作', text_en: 'I often procrastinate', domain: 'C', facet: 'C5', reversed: true },
  
  // C6: Cautiousness
  { id: 59, text: '我在做決定前會仔細考慮', text_en: 'I think carefully before making decisions', domain: 'C', facet: 'C6', reversed: false },
  { id: 60, text: '我常常衝動行事', text_en: 'I often act on impulse', domain: 'C', facet: 'C6', reversed: true },
];

export interface BigFiveResult {
  domains: {
    [key: string]: {
      score: number;       // Raw score (sum)
      percentage: number;  // 0-100 normalized
      facets: {
        [key: string]: {
          score: number;
          percentage: number;
        };
      };
    };
  };
}

/**
 * Calculate Big Five scores from answers
 * @param answers - Map of question ID to answer (1-5)
 * @returns BigFiveResult with domain and facet scores
 */
export function calculateBigFiveResults(answers: Record<number, number>): BigFiveResult {
  const result: BigFiveResult = { domains: {} };
  
  // Initialize domains
  for (const domain of domains) {
    result.domains[domain.code] = {
      score: 0,
      percentage: 0,
      facets: {},
    };
    for (const facet of domain.facets) {
      result.domains[domain.code].facets[facet.code] = {
        score: 0,
        percentage: 0,
      };
    }
  }
  
  // Calculate scores
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    
    // Handle reversed scoring
    const score = question.reversed ? (6 - answer) : answer;
    
    result.domains[question.domain].score += score;
    result.domains[question.domain].facets[question.facet].score += score;
  }
  
  // Calculate percentages
  // Each domain has 12 questions, score range: 12-60
  // Each facet has 2 questions, score range: 2-10
  for (const domain of domains) {
    const domainData = result.domains[domain.code];
    // Convert to percentage: (score - min) / (max - min) * 100
    domainData.percentage = Math.round(((domainData.score - 12) / 48) * 100);
    
    for (const facet of domain.facets) {
      const facetData = domainData.facets[facet.code];
      facetData.percentage = Math.round(((facetData.score - 2) / 8) * 100);
    }
  }
  
  return result;
}

export const domainDescriptions: Record<string, { high: string; low: string; moderate: string }> = {
  N: {
    high: '你對情緒較為敏感，可能更容易感受到焦慮、壓力或情緒波動。這也意味著你對環境變化更加警覺，能敏銳察覺潛在問題。',
    moderate: '你的情緒穩定性適中，能夠感受情緒但不會輕易被淹沒。你在面對壓力時通常能保持一定的平衡。',
    low: '你情緒穩定，面對壓力時能保持冷靜。你較少被負面情緒影響，心理韌性較強。',
  },
  E: {
    high: '你精力充沛，從社交中獲得能量。你喜歡與人互動，在團體中自在活躍，善於表達自己。',
    moderate: '你在社交和獨處之間保持平衡。你能享受社交活動，但也需要獨處時間來充電。',
    low: '你偏好安靜和獨處，從內在世界獲得能量。你更傾向深度的一對一交流，而非大型社交場合。',
  },
  O: {
    high: '你富有創造力和好奇心，喜歡探索新想法和體驗。你欣賞藝術和抽象思維，思想開放且富有想像力。',
    moderate: '你在傳統與創新之間保持平衡。你能欣賞新事物，但也重視實用性和穩定性。',
    low: '你務實且腳踏實地，偏好熟悉和具體的事物。你重視傳統和實際經驗，做事講究實效。',
  },
  A: {
    high: '你富有同理心，重視和諧與合作。你關心他人感受，樂於助人，善於維持良好的人際關係。',
    moderate: '你在關心他人與維護自身需求之間取得平衡。你既能合作也能在必要時據理力爭。',
    low: '你獨立且直接，更關注邏輯和效率而非取悅他人。你願意表達不同意見，競爭性較強。',
  },
  C: {
    high: '你有條理、自律且可靠。你善於規劃和執行，對自己有高標準，能夠堅持完成目標。',
    moderate: '你在結構化與靈活性之間保持平衡。你能完成任務，但也給自己留有彈性空間。',
    low: '你更隨性和靈活，不喜歡被嚴格的計畫束縛。你可能更擅長適應變化和即興發揮。',
  },
};

export function getDomainDescription(domain: string, percentage: number): string {
  const descriptions = domainDescriptions[domain];
  if (!descriptions) return '';
  
  if (percentage >= 60) return descriptions.high;
  if (percentage <= 40) return descriptions.low;
  return descriptions.moderate;
}
