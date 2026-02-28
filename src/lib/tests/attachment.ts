/**
 * Attachment Style Test
 * 
 * Based on: ECR-R (Experiences in Close Relationships-Revised)
 * Reference: Fraley, Waller, & Brennan (2000)
 * 
 * Structure:
 * - 2 dimensions: Anxiety and Avoidance
 * - 36 questions (18 per dimension in full version)
 * - We use 20 questions for a balanced shorter version
 * 
 * 4 Attachment Styles:
 * - Secure: Low Anxiety, Low Avoidance
 * - Anxious/Preoccupied: High Anxiety, Low Avoidance
 * - Dismissive-Avoidant: Low Anxiety, High Avoidance
 * - Fearful-Avoidant/Disorganized: High Anxiety, High Avoidance
 * 
 * Scoring: 7-point Likert in original; we use 5-point for consistency
 */

export interface AttachmentQuestion {
  id: number;
  text: string;
  text_en: string;
  dimension: 'anxiety' | 'avoidance';
  reversed: boolean;
}

export interface AttachmentStyle {
  code: string;
  name: string;
  name_en: string;
  description: string;
  characteristics: string[];
  quadrant: {
    anxiety: 'high' | 'low';
    avoidance: 'high' | 'low';
  };
}

export const attachmentStyles: AttachmentStyle[] = [
  {
    code: 'secure',
    name: '安全型',
    name_en: 'Secure',
    description: '你在關係中感到自在和安全。你能夠信任伴侶，也能獨立自主。你對自己和關係都有正面的看法。',
    characteristics: [
      '容易與他人建立親密關係',
      '能舒適地依賴伴侶，也讓伴侶依賴自己',
      '不太擔心被拋棄或他人過於親近',
      '溝通開放、直接',
      '能有效處理衝突',
    ],
    quadrant: { anxiety: 'low', avoidance: 'low' },
  },
  {
    code: 'anxious',
    name: '焦慮型',
    name_en: 'Anxious/Preoccupied',
    description: '你渴望親密和確認，可能會擔心伴侶不夠愛你或會離開你。你可能需要較多的情感回應和保證。',
    characteristics: [
      '對關係中的變化非常敏感',
      '需要頻繁的確認和回應',
      '可能會過度分析伴侶的行為',
      '害怕被拒絕或拋棄',
      '可能會犧牲自己的需求來維持關係',
    ],
    quadrant: { anxiety: 'high', avoidance: 'low' },
  },
  {
    code: 'avoidant',
    name: '迴避型',
    name_en: 'Dismissive-Avoidant',
    description: '你重視獨立和自主，可能會對過於親密的關係感到不適。你傾向於依靠自己，不太願意表達情感需求。',
    characteristics: [
      '高度重視獨立和自給自足',
      '可能會與伴侶保持情感距離',
      '不太舒適於討論感受',
      '可能會淡化親密關係的重要性',
      '在壓力下傾向退縮',
    ],
    quadrant: { anxiety: 'low', avoidance: 'high' },
  },
  {
    code: 'fearful',
    name: '恐懼型',
    name_en: 'Fearful-Avoidant/Disorganized',
    description: '你渴望親密但同時又害怕被傷害。你可能在接近和遠離之間掙扎，對關係抱持矛盾的態度。',
    characteristics: [
      '對親密關係有矛盾的感受',
      '可能會在想要親近和想要保護自己之間掙扎',
      '對信任他人感到困難',
      '可能會有不穩定的關係模式',
      '容易被過去的傷害影響',
    ],
    quadrant: { anxiety: 'high', avoidance: 'high' },
  },
];

// 20 questions adapted from ECR-R
// 10 Anxiety items + 10 Avoidance items
export const questions: AttachmentQuestion[] = [
  // ==================== ANXIETY DIMENSION (10 questions) ====================
  // Higher scores = more anxious attachment
  
  { id: 1, text: '我擔心伴侶不像我愛他/她那樣愛我', text_en: 'I worry that my partner does not love me as much as I love them', dimension: 'anxiety', reversed: false },
  { id: 2, text: '我很害怕失去伴侶的愛', text_en: 'I am very afraid of losing my partner\'s love', dimension: 'anxiety', reversed: false },
  { id: 3, text: '如果伴侶不在身邊，我會感到焦慮', text_en: 'I feel anxious when my partner is not around', dimension: 'anxiety', reversed: false },
  { id: 4, text: '我需要伴侶不斷確認他/她對我的愛', text_en: 'I need my partner to constantly reassure me of their love', dimension: 'anxiety', reversed: false },
  { id: 5, text: '我的渴望親密常常嚇跑他人', text_en: 'My desire for closeness sometimes scares people away', dimension: 'anxiety', reversed: false },
  { id: 6, text: '當伴侶沒有立即回覆訊息，我會不安', text_en: 'I feel uneasy when my partner doesn\'t reply to messages immediately', dimension: 'anxiety', reversed: false },
  { id: 7, text: '我擔心被拋棄', text_en: 'I worry about being abandoned', dimension: 'anxiety', reversed: false },
  { id: 8, text: '我對自己在關係中的價值感到懷疑', text_en: 'I doubt my worth in relationships', dimension: 'anxiety', reversed: false },
  { id: 9, text: '我經常希望伴侶對我的感覺和我對他/她的一樣強烈', text_en: 'I often wish my partner\'s feelings for me were as strong as mine for them', dimension: 'anxiety', reversed: false },
  { id: 10, text: '我很少擔心被拋棄', text_en: 'I rarely worry about being abandoned', dimension: 'anxiety', reversed: true },
  
  // ==================== AVOIDANCE DIMENSION (10 questions) ====================
  // Higher scores = more avoidant attachment
  
  { id: 11, text: '當伴侶想要很親密時，我會感到不自在', text_en: 'I feel uncomfortable when my partner wants to be very close', dimension: 'avoidance', reversed: false },
  { id: 12, text: '我很難完全依賴伴侶', text_en: 'I find it difficult to fully depend on my partner', dimension: 'avoidance', reversed: false },
  { id: 13, text: '我傾向於不對伴侶敞開心扉', text_en: 'I prefer not to open up to my partner', dimension: 'avoidance', reversed: false },
  { id: 14, text: '我不喜歡和伴侶分享我最深的感受', text_en: 'I don\'t like sharing my deepest feelings with my partner', dimension: 'avoidance', reversed: false },
  { id: 15, text: '我更喜歡保持獨立，而不是依賴伴侶', text_en: 'I prefer to be independent rather than rely on my partner', dimension: 'avoidance', reversed: false },
  { id: 16, text: '當伴侶過於依賴我，我會感到不舒服', text_en: 'I feel uncomfortable when my partner is too dependent on me', dimension: 'avoidance', reversed: false },
  { id: 17, text: '太親密讓我感到窒息', text_en: 'Too much closeness makes me feel suffocated', dimension: 'avoidance', reversed: false },
  { id: 18, text: '我不太習慣表達愛意', text_en: 'I am not comfortable expressing affection', dimension: 'avoidance', reversed: false },
  { id: 19, text: '我很容易對伴侶敞開心扉', text_en: 'I find it easy to open up to my partner', dimension: 'avoidance', reversed: true },
  { id: 20, text: '我很自在地依賴伴侶', text_en: 'I am comfortable depending on my partner', dimension: 'avoidance', reversed: true },
];

export interface AttachmentResult {
  style: string;
  anxiety: {
    score: number;
    percentage: number;
    level: 'low' | 'moderate' | 'high';
  };
  avoidance: {
    score: number;
    percentage: number;
    level: 'low' | 'moderate' | 'high';
  };
}

/**
 * Calculate Attachment Style results from answers
 * @param answers - Map of question ID to answer (1-5)
 * @returns AttachmentResult with style and dimension scores
 */
export function calculateAttachmentResults(answers: Record<number, number>): AttachmentResult {
  let anxietyScore = 0;
  let avoidanceScore = 0;
  let anxietyCount = 0;
  let avoidanceCount = 0;
  
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    
    // Handle reversed scoring
    const score = question.reversed ? (6 - answer) : answer;
    
    if (question.dimension === 'anxiety') {
      anxietyScore += score;
      anxietyCount++;
    } else {
      avoidanceScore += score;
      avoidanceCount++;
    }
  }
  
  // Calculate percentages (1-5 scale)
  // Raw score range: count * 1 to count * 5
  // Normalize to 0-100
  const anxietyPercentage = anxietyCount > 0
    ? Math.round(((anxietyScore - anxietyCount) / (anxietyCount * 4)) * 100)
    : 0;
  const avoidancePercentage = avoidanceCount > 0
    ? Math.round(((avoidanceScore - avoidanceCount) / (avoidanceCount * 4)) * 100)
    : 0;
  
  // Determine levels (thresholds at 35% and 65%)
  const getLevel = (pct: number): 'low' | 'moderate' | 'high' => {
    if (pct < 35) return 'low';
    if (pct > 65) return 'high';
    return 'moderate';
  };
  
  const anxietyLevel = getLevel(anxietyPercentage);
  const avoidanceLevel = getLevel(avoidancePercentage);
  
  // Determine attachment style based on quadrant
  let style: string;
  if (anxietyLevel === 'low' && avoidanceLevel === 'low') {
    style = 'secure';
  } else if (anxietyLevel === 'high' && avoidanceLevel === 'low') {
    style = 'anxious';
  } else if (anxietyLevel === 'low' && avoidanceLevel === 'high') {
    style = 'avoidant';
  } else if (anxietyLevel === 'high' && avoidanceLevel === 'high') {
    style = 'fearful';
  } else {
    // Moderate cases - determine based on relative scores
    if (anxietyPercentage > avoidancePercentage + 15) {
      style = 'anxious';
    } else if (avoidancePercentage > anxietyPercentage + 15) {
      style = 'avoidant';
    } else if (anxietyPercentage > 50 && avoidancePercentage > 50) {
      style = 'fearful';
    } else {
      style = 'secure';
    }
  }
  
  return {
    style,
    anxiety: {
      score: anxietyScore,
      percentage: anxietyPercentage,
      level: anxietyLevel,
    },
    avoidance: {
      score: avoidanceScore,
      percentage: avoidancePercentage,
      level: avoidanceLevel,
    },
  };
}

export function getStyleDescription(styleCode: string): AttachmentStyle | undefined {
  return attachmentStyles.find(s => s.code === styleCode);
}

// Dimension explanations
export const dimensionInfo = {
  anxiety: {
    name: '焦慮維度',
    name_en: 'Anxiety',
    lowDescription: '你對關係有安全感，不太擔心被拋棄或不被愛。你能夠信任伴侶，不需要持續的確認。',
    highDescription: '你可能會擔心伴侶對你的感覺，需要較多的確認和回應。你對關係中的變化可能比較敏感。',
  },
  avoidance: {
    name: '迴避維度',
    name_en: 'Avoidance',
    lowDescription: '你對親密感到自在，能夠依賴他人也讓他人依賴你。你願意分享感受和想法。',
    highDescription: '你可能更重視獨立性，對過於親密或依賴感到不自在。你可能傾向於保持情感距離。',
  },
};
