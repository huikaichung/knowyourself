/**
 * MBTI / 16 Personality Types Test
 * 
 * Based on: Jungian Cognitive Functions approach
 * Reference: 16personalities.com, Myers-Briggs theory
 * 
 * Structure:
 * - 4 dichotomies: E/I, S/N, T/F, J/P
 * - 8 cognitive functions considered for nuance
 * - 70 questions total (16-18 per dichotomy + balance items)
 * 
 * Scoring: 7-point scale (-3 to +3) or binary choice
 * We use 5-point Likert for consistency
 */

export interface MBTIQuestion {
  id: number;
  text: string;
  text_en: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  pole: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export interface MBTIDimension {
  code: string;
  name: string;
  poles: {
    code: string;
    name: string;
    description: string;
  }[];
}

export const dimensions: MBTIDimension[] = [
  {
    code: 'EI',
    name: '能量來源',
    poles: [
      { code: 'E', name: '外向 (Extraversion)', description: '從外界互動獲得能量' },
      { code: 'I', name: '內向 (Introversion)', description: '從內在反思獲得能量' },
    ],
  },
  {
    code: 'SN',
    name: '認知方式',
    poles: [
      { code: 'S', name: '實感 (Sensing)', description: '關注具體事實和細節' },
      { code: 'N', name: '直覺 (Intuition)', description: '關注模式、可能性和意義' },
    ],
  },
  {
    code: 'TF',
    name: '決策方式',
    poles: [
      { code: 'T', name: '思考 (Thinking)', description: '基於邏輯和客觀分析' },
      { code: 'F', name: '情感 (Feeling)', description: '基於價值觀和人際考量' },
    ],
  },
  {
    code: 'JP',
    name: '生活方式',
    poles: [
      { code: 'J', name: '判斷 (Judging)', description: '偏好計畫、結構和決定' },
      { code: 'P', name: '知覺 (Perceiving)', description: '偏好彈性、開放和適應' },
    ],
  },
];

// 70 questions designed to measure MBTI dimensions
// Each question asks agreement with a statement that indicates one pole
export const questions: MBTIQuestion[] = [
  // ==================== E/I (18 questions) ====================
  { id: 1, text: '在社交聚會後，我感到精力充沛', text_en: 'I feel energized after social gatherings', dimension: 'EI', pole: 'E' },
  { id: 2, text: '我更喜歡一對一的深度交談而非群體社交', text_en: 'I prefer deep one-on-one conversations over group socializing', dimension: 'EI', pole: 'I' },
  { id: 3, text: '我很容易與陌生人攀談', text_en: 'I easily start conversations with strangers', dimension: 'EI', pole: 'E' },
  { id: 4, text: '在做重要決定前，我需要獨處思考', text_en: 'I need alone time to think before making important decisions', dimension: 'EI', pole: 'I' },
  { id: 5, text: '我在團體討論中經常主動發言', text_en: 'I often speak up in group discussions', dimension: 'EI', pole: 'E' },
  { id: 6, text: '太多社交活動會讓我感到疲憊', text_en: 'Too much socializing drains my energy', dimension: 'EI', pole: 'I' },
  { id: 7, text: '我喜歡認識新朋友', text_en: 'I enjoy meeting new people', dimension: 'EI', pole: 'E' },
  { id: 8, text: '我的內心世界比外在表現更豐富', text_en: 'My inner world is richer than what I show outwardly', dimension: 'EI', pole: 'I' },
  { id: 9, text: '我透過與他人討論來整理想法', text_en: 'I process my thoughts by discussing with others', dimension: 'EI', pole: 'E' },
  { id: 10, text: '我寧願用文字表達而不是口頭說明', text_en: 'I prefer expressing myself in writing rather than speaking', dimension: 'EI', pole: 'I' },
  { id: 11, text: '我容易感到無聊，需要外在刺激', text_en: 'I get bored easily and need external stimulation', dimension: 'EI', pole: 'E' },
  { id: 12, text: '我在獨處時最能發揮創造力', text_en: 'I am most creative when alone', dimension: 'EI', pole: 'I' },
  { id: 13, text: '我喜歡成為注目焦點', text_en: 'I enjoy being the center of attention', dimension: 'EI', pole: 'E' },
  { id: 14, text: '我需要時間獨自充電才能恢復精力', text_en: 'I need time alone to recharge my energy', dimension: 'EI', pole: 'I' },
  { id: 15, text: '我經常主動邀約朋友出來', text_en: 'I often initiate plans with friends', dimension: 'EI', pole: 'E' },
  { id: 16, text: '在說話之前，我會先在腦中組織好想法', text_en: 'I organize my thoughts internally before speaking', dimension: 'EI', pole: 'I' },
  { id: 17, text: '我在人群中感到自在', text_en: 'I feel comfortable in crowds', dimension: 'EI', pole: 'E' },
  { id: 18, text: '我珍惜獨處的時光', text_en: 'I treasure my alone time', dimension: 'EI', pole: 'I' },
  
  // ==================== S/N (18 questions) ====================
  { id: 19, text: '我更關注眼前的現實而非未來的可能', text_en: 'I focus more on present reality than future possibilities', dimension: 'SN', pole: 'S' },
  { id: 20, text: '我經常思考事物背後更深的意義', text_en: 'I often think about deeper meanings behind things', dimension: 'SN', pole: 'N' },
  { id: 21, text: '我相信實際經驗勝過理論', text_en: 'I trust practical experience over theory', dimension: 'SN', pole: 'S' },
  { id: 22, text: '我喜歡探索各種可能性和假設', text_en: 'I enjoy exploring possibilities and hypotheticals', dimension: 'SN', pole: 'N' },
  { id: 23, text: '我注重細節和準確性', text_en: 'I pay attention to details and accuracy', dimension: 'SN', pole: 'S' },
  { id: 24, text: '我善於看出事物之間的關聯和模式', text_en: 'I am good at seeing connections and patterns', dimension: 'SN', pole: 'N' },
  { id: 25, text: '我按照既定的步驟來學習新事物', text_en: 'I learn new things by following established steps', dimension: 'SN', pole: 'S' },
  { id: 26, text: '我常常有創新的想法和靈感', text_en: 'I often have innovative ideas and inspirations', dimension: 'SN', pole: 'N' },
  { id: 27, text: '我喜歡具體、明確的指示', text_en: 'I prefer specific and clear instructions', dimension: 'SN', pole: 'S' },
  { id: 28, text: '我容易對重複的工作感到厭倦', text_en: 'I easily get bored with repetitive work', dimension: 'SN', pole: 'N' },
  { id: 29, text: '我記得過去經歷的具體細節', text_en: 'I remember specific details of past experiences', dimension: 'SN', pole: 'S' },
  { id: 30, text: '我更關心「為什麼」而不是「是什麼」', text_en: 'I care more about "why" than "what"', dimension: 'SN', pole: 'N' },
  { id: 31, text: '我傾向於按照已證實有效的方法做事', text_en: 'I tend to do things the proven way', dimension: 'SN', pole: 'S' },
  { id: 32, text: '我喜歡想像未來的各種情境', text_en: 'I enjoy imagining various future scenarios', dimension: 'SN', pole: 'N' },
  { id: 33, text: '我是個務實的人，腳踏實地', text_en: 'I am a practical, down-to-earth person', dimension: 'SN', pole: 'S' },
  { id: 34, text: '我經常有「靈光一現」的時刻', text_en: 'I often have "aha" moments of insight', dimension: 'SN', pole: 'N' },
  { id: 35, text: '我重視實際的用途和效果', text_en: 'I value practical usefulness and results', dimension: 'SN', pole: 'S' },
  { id: 36, text: '我喜歡抽象的概念和理論', text_en: 'I enjoy abstract concepts and theories', dimension: 'SN', pole: 'N' },
  
  // ==================== T/F (18 questions) ====================
  { id: 37, text: '做決定時，我優先考慮邏輯和公平', text_en: 'When making decisions, I prioritize logic and fairness', dimension: 'TF', pole: 'T' },
  { id: 38, text: '我很在意決定會如何影響他人的感受', text_en: 'I care about how decisions will affect others\' feelings', dimension: 'TF', pole: 'F' },
  { id: 39, text: '我認為誠實比圓滑更重要', text_en: 'I believe honesty is more important than tact', dimension: 'TF', pole: 'T' },
  { id: 40, text: '維持和諧關係對我很重要', text_en: 'Maintaining harmonious relationships is important to me', dimension: 'TF', pole: 'F' },
  { id: 41, text: '我善於分析問題的利弊得失', text_en: 'I am good at analyzing pros and cons', dimension: 'TF', pole: 'T' },
  { id: 42, text: '我很容易感同身受他人的處境', text_en: 'I easily empathize with others\' situations', dimension: 'TF', pole: 'F' },
  { id: 43, text: '我傾向於根據原則而非個人情況做判斷', text_en: 'I tend to judge based on principles rather than individual circumstances', dimension: 'TF', pole: 'T' },
  { id: 44, text: '我會為他人的成功感到由衷高興', text_en: 'I genuinely feel happy for others\' success', dimension: 'TF', pole: 'F' },
  { id: 45, text: '我在辯論中能保持客觀冷靜', text_en: 'I can stay objective and calm in debates', dimension: 'TF', pole: 'T' },
  { id: 46, text: '我擅長調解人際衝突', text_en: 'I am good at mediating interpersonal conflicts', dimension: 'TF', pole: 'F' },
  { id: 47, text: '我寧願被認為是公正的而不是仁慈的', text_en: 'I would rather be seen as fair than as merciful', dimension: 'TF', pole: 'T' },
  { id: 48, text: '我對他人的情緒變化很敏感', text_en: 'I am sensitive to others\' emotional changes', dimension: 'TF', pole: 'F' },
  { id: 49, text: '我認為有時候需要做出艱難但正確的決定', text_en: 'I believe sometimes tough but right decisions must be made', dimension: 'TF', pole: 'T' },
  { id: 50, text: '我常常把他人的需求放在自己之前', text_en: 'I often put others\' needs before my own', dimension: 'TF', pole: 'F' },
  { id: 51, text: '我欣賞有邏輯、條理分明的論述', text_en: 'I appreciate logical and well-structured arguments', dimension: 'TF', pole: 'T' },
  { id: 52, text: '我重視個人價值觀和信念', text_en: 'I value personal values and beliefs', dimension: 'TF', pole: 'F' },
  { id: 53, text: '批評他人時我會直接指出問題', text_en: 'I directly point out problems when criticizing others', dimension: 'TF', pole: 'T' },
  { id: 54, text: '我在給反饋時會考慮對方的感受', text_en: 'I consider others\' feelings when giving feedback', dimension: 'TF', pole: 'F' },
  
  // ==================== J/P (16 questions) ====================
  { id: 55, text: '我喜歡事先計畫好行程', text_en: 'I like to plan things in advance', dimension: 'JP', pole: 'J' },
  { id: 56, text: '我喜歡保持選項開放，隨機應變', text_en: 'I like keeping options open and adapting as I go', dimension: 'JP', pole: 'P' },
  { id: 57, text: '我會在截止日期前完成任務', text_en: 'I complete tasks well before deadlines', dimension: 'JP', pole: 'J' },
  { id: 58, text: '我在壓力下反而更有效率', text_en: 'I work more efficiently under pressure', dimension: 'JP', pole: 'P' },
  { id: 59, text: '我喜歡有明確的規則和結構', text_en: 'I prefer clear rules and structure', dimension: 'JP', pole: 'J' },
  { id: 60, text: '我享受即興和自發的活動', text_en: 'I enjoy spontaneous activities', dimension: 'JP', pole: 'P' },
  { id: 61, text: '做完決定後我很少再改變', text_en: 'Once I make a decision, I rarely change it', dimension: 'JP', pole: 'J' },
  { id: 62, text: '我喜歡探索各種可能才做決定', text_en: 'I like exploring all possibilities before deciding', dimension: 'JP', pole: 'P' },
  { id: 63, text: '我的生活有固定的作息', text_en: 'My life has a fixed routine', dimension: 'JP', pole: 'J' },
  { id: 64, text: '我喜歡生活中的變化和驚喜', text_en: 'I enjoy changes and surprises in life', dimension: 'JP', pole: 'P' },
  { id: 65, text: '我會列清單來追蹤待辦事項', text_en: 'I make lists to track my to-dos', dimension: 'JP', pole: 'J' },
  { id: 66, text: '我更喜歡走一步看一步', text_en: 'I prefer to go with the flow', dimension: 'JP', pole: 'P' },
  { id: 67, text: '未完成的事會讓我感到不安', text_en: 'Unfinished tasks make me feel uneasy', dimension: 'JP', pole: 'J' },
  { id: 68, text: '我能輕鬆適應計畫的改變', text_en: 'I easily adapt to changes in plans', dimension: 'JP', pole: 'P' },
  { id: 69, text: '我喜歡把事情一次做到好', text_en: 'I like to complete things properly the first time', dimension: 'JP', pole: 'J' },
  { id: 70, text: '我覺得過度規劃會限制自由', text_en: 'I feel over-planning limits freedom', dimension: 'JP', pole: 'P' },
];

export interface DimensionResult {
  dominant: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  percentage: number;
  [key: string]: string | number;
}

export interface MBTIResult {
  type: string; // e.g., "INTJ"
  dimensions: {
    EI: DimensionResult;
    SN: DimensionResult;
    TF: DimensionResult;
    JP: DimensionResult;
  };
}

/**
 * Calculate MBTI type from answers
 * @param answers - Map of question ID to answer (1-5)
 * @returns MBTIResult with type and dimension scores
 */
export function calculateMBTIResults(answers: Record<number, number>): MBTIResult {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  };
  
  // Count weighted scores
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    
    // Answer 1-5 maps to weights
    // 5 = strongly agree with the pole (+2)
    // 4 = agree (+1)
    // 3 = neutral (0)
    // 2 = disagree (-1 for this pole = +1 for opposite)
    // 1 = strongly disagree (+2 for opposite pole)
    
    const weight = answer - 3; // -2 to +2
    
    if (weight > 0) {
      scores[question.pole as keyof typeof scores] += weight;
    } else if (weight < 0) {
      // Add to opposite pole
      const opposite = getOppositePole(question.pole);
      scores[opposite as keyof typeof scores] += Math.abs(weight);
    }
  }
  
  // Determine dominant poles and calculate percentages
  const result: MBTIResult = {
    type: '',
    dimensions: {
      EI: calculateDimensionResult(scores.E, scores.I, 'E', 'I'),
      SN: calculateDimensionResult(scores.S, scores.N, 'S', 'N'),
      TF: calculateDimensionResult(scores.T, scores.F, 'T', 'F'),
      JP: calculateDimensionResult(scores.J, scores.P, 'J', 'P'),
    },
  };
  
  result.type = `${result.dimensions.EI.dominant}${result.dimensions.SN.dominant}${result.dimensions.TF.dominant}${result.dimensions.JP.dominant}`;
  
  return result;
}

function getOppositePole(pole: string): string {
  const opposites: Record<string, string> = {
    E: 'I', I: 'E',
    S: 'N', N: 'S',
    T: 'F', F: 'T',
    J: 'P', P: 'J',
  };
  return opposites[pole];
}

function calculateDimensionResult(
  score1: number, 
  score2: number, 
  pole1: string, 
  pole2: string
): DimensionResult {
  const total = score1 + score2 || 1;
  const dominant = score1 >= score2 ? pole1 : pole2;
  const percentage = Math.round((Math.max(score1, score2) / total) * 100);
  
  return {
    [pole1]: score1,
    [pole2]: score2,
    dominant: dominant as 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P',
    percentage,
  };
}

// Type descriptions
export const typeDescriptions: Record<string, { name: string; title: string; description: string }> = {
  INTJ: {
    name: 'INTJ',
    title: '策略家',
    description: '獨立思考的策略家，善於制定長遠計畫。你具有強烈的好奇心和創造力，追求知識和效率。你喜歡挑戰既有觀念，尋找更好的做事方式。',
  },
  INTP: {
    name: 'INTP',
    title: '邏輯學家',
    description: '創新的思想家，熱愛探索理論和抽象概念。你享受分析複雜問題，對知識有無盡的渴望。你重視邏輯和理性，喜歡獨立思考。',
  },
  ENTJ: {
    name: 'ENTJ',
    title: '指揮官',
    description: '天生的領導者，果斷而有魄力。你善於組織和規劃，追求效率和成就。你對自己和他人都有高標準，喜歡掌控局面。',
  },
  ENTP: {
    name: 'ENTP',
    title: '辯論家',
    description: '聰明的創新者，喜歡挑戰思維。你善於辯論和提出新觀點，不怕質疑權威。你充滿好奇心，喜歡探索各種可能性。',
  },
  INFJ: {
    name: 'INFJ',
    title: '提倡者',
    description: '理想主義的夢想家，有著強烈的價值觀。你深思熟慮，關心他人的福祉。你追求有意義的連結，希望為世界帶來正面影響。',
  },
  INFP: {
    name: 'INFP',
    title: '調停者',
    description: '富有同理心的理想主義者。你有豐富的內心世界，重視真誠和個人價值。你追求自我表達和意義，關心人類的情感體驗。',
  },
  ENFJ: {
    name: 'ENFJ',
    title: '主人公',
    description: '魅力十足的領導者，善於激勵他人。你關心人們的成長和幸福，樂於提供幫助和指導。你重視和諧，善於調解衝突。',
  },
  ENFP: {
    name: 'ENFP',
    title: '競選者',
    description: '熱情洋溢的自由靈魂。你充滿創意和好奇心，善於發現人們的潛力。你追求真實的連結，喜歡探索新的可能性。',
  },
  ISTJ: {
    name: 'ISTJ',
    title: '物流師',
    description: '可靠負責的務實者。你重視傳統和秩序，對細節一絲不苟。你言出必行，是值得信賴的人。你喜歡按照既定的方式做事。',
  },
  ISFJ: {
    name: 'ISFJ',
    title: '守衛者',
    description: '溫暖細心的保護者。你記得重要的細節，默默關心身邊的人。你謙遜勤勉，重視和諧和穩定。你是可靠的支持者。',
  },
  ESTJ: {
    name: 'ESTJ',
    title: '總經理',
    description: '高效的組織者和管理者。你重視秩序和規則，善於執行和管理。你直接坦率，追求結果和效率。你是天生的組織者。',
  },
  ESFJ: {
    name: 'ESFJ',
    title: '執政官',
    description: '熱心助人的社交者。你關心他人的需求，喜歡照顧周圍的人。你重視和諧和傳統，是團體中的凝聚力量。',
  },
  ISTP: {
    name: 'ISTP',
    title: '鑑賞家',
    description: '冷靜的問題解決者。你善於分析和動手解決問題，喜歡了解事物如何運作。你獨立自主，追求效率和實用性。',
  },
  ISFP: {
    name: 'ISFP',
    title: '探險家',
    description: '溫和的藝術家。你欣賞美和和諧，喜歡活在當下。你有強烈的個人價值觀，但不喜歡強加於人。你享受探索新體驗。',
  },
  ESTP: {
    name: 'ESTP',
    title: '企業家',
    description: '精力充沛的冒險者。你善於把握機會，喜歡即時的行動和結果。你務實且適應力強，在危機中表現出色。',
  },
  ESFP: {
    name: 'ESFP',
    title: '表演者',
    description: '熱情的表演者，活力四射。你喜歡成為注目焦點，享受生活中的樂趣。你慷慨友善，善於讓周圍的人感到快樂。',
  },
};
