/**
 * Enneagram Personality Test
 * 
 * Based on: RHETI (Riso-Hudson Enneagram Type Indicator) approach
 * Reference: Enneagram Institute, Truity
 * 
 * Structure:
 * - 9 types with distinct motivations and fears
 * - 36 questions (4 per type)
 * - Each question measures agreement with type-specific traits
 * 
 * Scoring: 5-point Likert scale
 */

export interface EnneagramQuestion {
  id: number;
  text: string;
  text_en: string;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export interface EnneagramType {
  type: number;
  name: string;
  title: string;
  description: string;
  coreMotivation: string;
  coreFear: string;
  coreDesire: string;
  wing1: number;
  wing2: number;
}

export const types: EnneagramType[] = [
  {
    type: 1,
    name: '完美主義者',
    title: 'The Reformer',
    description: '有原則、有目標的類型。有道德感、認真、自律，追求完美與正確。',
    coreMotivation: '做正確的事，保持誠信和平衡',
    coreFear: '害怕犯錯、腐敗或有缺陷',
    coreDesire: '渴望正直、完善和被認可為好人',
    wing1: 9,
    wing2: 2,
  },
  {
    type: 2,
    name: '助人者',
    title: 'The Helper',
    description: '關懷、人際取向的類型。慷慨、討好他人、佔有慾強，真誠地想要幫助他人。',
    coreMotivation: '被愛、被需要、被欣賞',
    coreFear: '害怕不被愛、不被需要',
    coreDesire: '渴望被愛和感到有價值',
    wing1: 1,
    wing2: 3,
  },
  {
    type: 3,
    name: '成就者',
    title: 'The Achiever',
    description: '成功導向、務實的類型。適應力強、出色、有幹勁，注重形象和成就。',
    coreMotivation: '獲得成功和成就，被他人欽佩',
    coreFear: '害怕一無是處或沒有價值',
    coreDesire: '渴望感到有價值和被接受',
    wing1: 2,
    wing2: 4,
  },
  {
    type: 4,
    name: '個人主義者',
    title: 'The Individualist',
    description: '敏感、內省的類型。表達力強、戲劇化、自我沉溺，追求獨特和真實。',
    coreMotivation: '表達自我，找到獨特的身份認同',
    coreFear: '害怕沒有身份認同或個人意義',
    coreDesire: '渴望找到自己並表達獨特性',
    wing1: 3,
    wing2: 5,
  },
  {
    type: 5,
    name: '觀察者',
    title: 'The Investigator',
    description: '專注、理性的類型。洞察力強、創新、隱秘，追求知識和理解。',
    coreMotivation: '理解環境，擁有足夠的知識和能力',
    coreFear: '害怕無能、無用或被淹沒',
    coreDesire: '渴望有能力和知識',
    wing1: 4,
    wing2: 6,
  },
  {
    type: 6,
    name: '忠誠者',
    title: 'The Loyalist',
    description: '忠誠、安全取向的類型。負責、可靠、警覺，尋求安全感和支持。',
    coreMotivation: '獲得安全感和支持',
    coreFear: '害怕沒有支持和指引',
    coreDesire: '渴望安全和確定性',
    wing1: 5,
    wing2: 7,
  },
  {
    type: 7,
    name: '享樂主義者',
    title: 'The Enthusiast',
    description: '忙碌、多產的類型。多才多藝、樂觀、自發，追求新體驗和快樂。',
    coreMotivation: '保持快樂和滿足，逃避痛苦',
    coreFear: '害怕被剝奪或困在痛苦中',
    coreDesire: '渴望滿足和快樂',
    wing1: 6,
    wing2: 8,
  },
  {
    type: 8,
    name: '挑戰者',
    title: 'The Challenger',
    description: '強大、主導的類型。自信、果斷、對抗性強，追求控制和獨立。',
    coreMotivation: '保護自己，掌控環境',
    coreFear: '害怕被控制或傷害',
    coreDesire: '渴望保護自己和掌控命運',
    wing1: 7,
    wing2: 9,
  },
  {
    type: 9,
    name: '和平者',
    title: 'The Peacemaker',
    description: '隨和、自我消除的類型。接納、信任、穩定，追求和平與和諧。',
    coreMotivation: '保持內心和外在的和平',
    coreFear: '害怕失去連結和分裂',
    coreDesire: '渴望內心平靜和穩定',
    wing1: 8,
    wing2: 1,
  },
];

// 36 questions, 4 per type
export const questions: EnneagramQuestion[] = [
  // Type 1: The Reformer (4 questions)
  { id: 1, text: '我對自己有很高的道德標準', text_en: 'I have high moral standards for myself', type: 1 },
  { id: 2, text: '看到不公正的事情，我會感到憤怒', text_en: 'I feel angry when I see injustice', type: 1 },
  { id: 3, text: '我常常批評自己做得不夠好', text_en: 'I often criticize myself for not being good enough', type: 1 },
  { id: 4, text: '我覺得事情有正確的做法，應該遵循', text_en: 'I believe there is a right way to do things', type: 1 },
  
  // Type 2: The Helper (4 questions)
  { id: 5, text: '幫助他人讓我感到滿足', text_en: 'Helping others makes me feel fulfilled', type: 2 },
  { id: 6, text: '我很容易察覺他人的需求', text_en: 'I easily notice what others need', type: 2 },
  { id: 7, text: '我希望被人需要和欣賞', text_en: 'I want to be needed and appreciated', type: 2 },
  { id: 8, text: '我有時會為了取悅他人而忽略自己的需求', text_en: 'I sometimes neglect my own needs to please others', type: 2 },
  
  // Type 3: The Achiever (4 questions)
  { id: 9, text: '成功和成就對我非常重要', text_en: 'Success and achievement are very important to me', type: 3 },
  { id: 10, text: '我在意別人如何看待我', text_en: 'I care about how others perceive me', type: 3 },
  { id: 11, text: '我總是在追求下一個目標', text_en: 'I am always pursuing the next goal', type: 3 },
  { id: 12, text: '我擅長展現自己最好的一面', text_en: 'I am good at presenting my best self', type: 3 },
  
  // Type 4: The Individualist (4 questions)
  { id: 13, text: '我覺得自己與眾不同，難以被理解', text_en: 'I feel different and hard to be understood', type: 4 },
  { id: 14, text: '我有強烈的情感體驗', text_en: 'I have intense emotional experiences', type: 4 },
  { id: 15, text: '我追求真實和深度，不喜歡膚淺', text_en: 'I seek authenticity and depth, not superficiality', type: 4 },
  { id: 16, text: '我常常感到有些缺失或遺憾', text_en: 'I often feel a sense of longing or melancholy', type: 4 },
  
  // Type 5: The Investigator (4 questions)
  { id: 17, text: '我喜歡深入研究感興趣的主題', text_en: 'I love to deeply research topics that interest me', type: 5 },
  { id: 18, text: '我需要獨處時間來思考和充電', text_en: 'I need alone time to think and recharge', type: 5 },
  { id: 19, text: '我傾向於觀察而非參與', text_en: 'I tend to observe rather than participate', type: 5 },
  { id: 20, text: '擁有知識和理解讓我感到安全', text_en: 'Having knowledge and understanding makes me feel secure', type: 5 },
  
  // Type 6: The Loyalist (4 questions)
  { id: 21, text: '我會考慮各種可能的風險和問題', text_en: 'I consider various possible risks and problems', type: 6 },
  { id: 22, text: '我重視忠誠和信任的關係', text_en: 'I value loyal and trustworthy relationships', type: 6 },
  { id: 23, text: '面對不確定性，我會感到焦慮', text_en: 'I feel anxious when facing uncertainty', type: 6 },
  { id: 24, text: '我常常懷疑事情會不會出錯', text_en: 'I often wonder if things will go wrong', type: 6 },
  
  // Type 7: The Enthusiast (4 questions)
  { id: 25, text: '我喜歡保持多種選擇和可能性', text_en: 'I like to keep multiple options and possibilities open', type: 7 },
  { id: 26, text: '我很容易對新事物感到興奮', text_en: 'I easily get excited about new things', type: 7 },
  { id: 27, text: '我傾向於逃避負面情緒或無聊', text_en: 'I tend to avoid negative emotions or boredom', type: 7 },
  { id: 28, text: '我總是在計畫下一個有趣的事情', text_en: 'I am always planning the next fun thing', type: 7 },
  
  // Type 8: The Challenger (4 questions)
  { id: 29, text: '我不喜歡被他人控制', text_en: 'I do not like being controlled by others', type: 8 },
  { id: 30, text: '我傾向於直接和坦率', text_en: 'I tend to be direct and straightforward', type: 8 },
  { id: 31, text: '我會挺身保護弱者', text_en: 'I stand up to protect the weak', type: 8 },
  { id: 32, text: '我喜歡掌控局面', text_en: 'I like to be in control of situations', type: 8 },
  
  // Type 9: The Peacemaker (4 questions)
  { id: 33, text: '我傾向於避免衝突', text_en: 'I tend to avoid conflict', type: 9 },
  { id: 34, text: '我可以理解各方的觀點', text_en: 'I can understand different perspectives', type: 9 },
  { id: 35, text: '我有時會壓抑自己的需求來維持和平', text_en: 'I sometimes suppress my needs to maintain peace', type: 9 },
  { id: 36, text: '我偏好穩定和舒適的環境', text_en: 'I prefer stable and comfortable environments', type: 9 },
];

export interface EnneagramResult {
  primaryType: number;
  wing: number | null;
  scores: Record<number, number>;
  percentages: Record<number, number>;
}

/**
 * Calculate Enneagram results from answers
 * @param answers - Map of question ID to answer (1-5)
 * @returns EnneagramResult with type, wing, and scores
 */
export function calculateEnneagramResults(answers: Record<number, number>): EnneagramResult {
  // Initialize scores for each type
  const scores: Record<number, number> = {};
  const counts: Record<number, number> = {};
  
  for (let i = 1; i <= 9; i++) {
    scores[i] = 0;
    counts[i] = 0;
  }
  
  // Calculate scores
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    
    scores[question.type] += answer;
    counts[question.type]++;
  }
  
  // Calculate percentages (each type has 4 questions, max score = 20)
  const percentages: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    const maxScore = counts[i] * 5;
    const minScore = counts[i] * 1;
    percentages[i] = maxScore > minScore 
      ? Math.round(((scores[i] - minScore) / (maxScore - minScore)) * 100)
      : 0;
  }
  
  // Find primary type (highest score)
  let primaryType = 1;
  let maxScore = scores[1];
  for (let i = 2; i <= 9; i++) {
    if (scores[i] > maxScore) {
      maxScore = scores[i];
      primaryType = i;
    }
  }
  
  // Determine wing (adjacent type with higher score)
  const typeInfo = types.find(t => t.type === primaryType);
  let wing: number | null = null;
  if (typeInfo) {
    const wing1Score = scores[typeInfo.wing1] || 0;
    const wing2Score = scores[typeInfo.wing2] || 0;
    
    if (wing1Score > wing2Score) {
      wing = typeInfo.wing1;
    } else if (wing2Score > wing1Score) {
      wing = typeInfo.wing2;
    }
    // If equal, wing remains null
  }
  
  return {
    primaryType,
    wing,
    scores,
    percentages,
  };
}

export function getTypeDescription(typeNum: number): EnneagramType | undefined {
  return types.find(t => t.type === typeNum);
}

// Triadic centers (also known as intelligence centers)
export const centers = {
  gut: {
    name: '本能中心',
    name_en: 'Gut Center',
    types: [8, 9, 1],
    coreEmotion: '憤怒',
    description: '這三種類型以本能反應為主，核心情緒是憤怒（可能外顯或壓抑）',
  },
  heart: {
    name: '情感中心',
    name_en: 'Heart Center',
    types: [2, 3, 4],
    coreEmotion: '羞恥',
    description: '這三種類型以情感為主，核心情緒是羞恥（與自我價值和形象有關）',
  },
  head: {
    name: '思維中心',
    name_en: 'Head Center',
    types: [5, 6, 7],
    coreEmotion: '恐懼',
    description: '這三種類型以思考為主，核心情緒是恐懼（對未知和不安全的恐懼）',
  },
};
