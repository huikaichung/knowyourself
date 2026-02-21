'use client';

/**
 * Western Astrology Natal Chart SVG - Interactive
 * 12 houses wheel with clickable planet positions
 */

interface Planet {
  name: string;
  sign: string;
  degree: string;
  house: number;
  retrograde?: boolean;
  interpretation?: string;
}

interface Props {
  planets: Planet[];
  ascendant?: { sign: string; degree?: string };
  onPlanetClick?: (planet: Planet) => void;
  onSignClick?: (sign: string) => void;
}

// Zodiac signs in order
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_SYMBOLS: Record<string, string> = {
  'Aries': '♈', '牡羊座': '♈',
  'Taurus': '♉', '金牛座': '♉',
  'Gemini': '♊', '雙子座': '♊',
  'Cancer': '♋', '巨蟹座': '♋',
  'Leo': '♌', '獅子座': '♌',
  'Virgo': '♍', '處女座': '♍',
  'Libra': '♎', '天秤座': '♎',
  'Scorpio': '♏', '天蠍座': '♏',
  'Sagittarius': '♐', '射手座': '♐',
  'Capricorn': '♑', '摩羯座': '♑',
  'Aquarius': '♒', '水瓶座': '♒',
  'Pisces': '♓', '雙魚座': '♓',
};

const SIGN_NAMES: Record<string, string> = {
  'Aries': '牡羊座', '牡羊座': '牡羊座',
  'Taurus': '金牛座', '金牛座': '金牛座',
  'Gemini': '雙子座', '雙子座': '雙子座',
  'Cancer': '巨蟹座', '巨蟹座': '巨蟹座',
  'Leo': '獅子座', '獅子座': '獅子座',
  'Virgo': '處女座', '處女座': '處女座',
  'Libra': '天秤座', '天秤座': '天秤座',
  'Scorpio': '天蠍座', '天蠍座': '天蠍座',
  'Sagittarius': '射手座', '射手座': '射手座',
  'Capricorn': '摩羯座', '摩羯座': '摩羯座',
  'Aquarius': '水瓶座', '水瓶座': '水瓶座',
  'Pisces': '雙魚座', '雙魚座': '雙魚座',
};

const PLANET_SYMBOLS: Record<string, string> = {
  '太陽': '☉', 'Sun': '☉',
  '月亮': '☽', 'Moon': '☽',
  '水星': '☿', 'Mercury': '☿',
  '金星': '♀', 'Venus': '♀',
  '火星': '♂', 'Mars': '♂',
  '木星': '♃', 'Jupiter': '♃',
  '土星': '♄', 'Saturn': '♄',
  '天王星': '♅', 'Uranus': '♅',
  '海王星': '♆', 'Neptune': '♆',
  '冥王星': '♇', 'Pluto': '♇',
};

const PLANET_COLORS: Record<string, string> = {
  '太陽': '#FFD700',
  '月亮': '#C0C0C0',
  '水星': '#87CEEB',
  '金星': '#FFB6C1',
  '火星': '#FF6347',
  '木星': '#FFA500',
  '土星': '#8B4513',
  '天王星': '#00CED1',
  '海王星': '#4169E1',
  '冥王星': '#800080',
};

function getSignIndex(sign: string): number {
  // Try English first
  const idx = SIGNS.findIndex(s => sign.includes(s) || s.includes(sign));
  if (idx >= 0) return idx;
  
  // Try Chinese
  const chineseMap: Record<string, number> = {
    '牡羊': 0, '金牛': 1, '雙子': 2, '巨蟹': 3,
    '獅子': 4, '處女': 5, '天秤': 6, '天蠍': 7,
    '射手': 8, '摩羯': 9, '水瓶': 10, '雙魚': 11,
  };
  for (const [key, val] of Object.entries(chineseMap)) {
    if (sign.includes(key)) return val;
  }
  return 0;
}

function parseDegree(degreeStr: string): number {
  // Parse "22°" or "22" or "22度"
  const match = degreeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function calculatePlanetAngle(planet: Planet, ascSign: string): number {
  // Calculate angle from Ascendant (which is at 9 o'clock / 180°)
  const ascIdx = getSignIndex(ascSign);
  const planetIdx = getSignIndex(planet.sign);
  const degree = parseDegree(planet.degree);
  
  // Each sign is 30°, Ascendant is at 180° (left side)
  const signOffset = ((planetIdx - ascIdx + 12) % 12) * 30;
  const angle = 180 - signOffset - degree;
  
  return angle;
}

export function NatalChart({ planets, ascendant, onPlanetClick, onSignClick }: Props) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 10;
  const signR = outerR - 25;
  const houseR = signR - 15;
  const planetR = houseR - 30;
  const innerR = planetR - 25;

  const ascSign = ascendant?.sign || '牡羊座';

  // Generate house lines (12 divisions)
  const houseLines = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = cx + houseR * Math.cos(angle);
    const y1 = cy + houseR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);
    return { x1, y1, x2, y2 };
  });

  // Sign symbols positions with sign names for click handling
  const signPositions = Array.from({ length: 12 }, (_, i) => {
    const ascIdx = getSignIndex(ascSign);
    const signIdx = (ascIdx + i) % 12;
    const angle = (180 - i * 30 - 15) * (Math.PI / 180);
    const x = cx + (signR - 12) * Math.cos(angle);
    const y = cy + (signR - 12) * Math.sin(angle);
    const signName = Object.keys(SIGN_SYMBOLS).find(k => 
      getSignIndex(k) === signIdx && SIGN_SYMBOLS[k]
    ) || SIGNS[signIdx];
    const cnName = SIGN_NAMES[signName] || signName;
    return { x, y, symbol: SIGN_SYMBOLS[signName] || '?', name: cnName };
  });

  // Planet positions
  const planetPositions = planets.map((planet, idx) => {
    const angle = calculatePlanetAngle(planet, ascSign) * (Math.PI / 180);
    // Spread planets slightly if they're close
    const spreadOffset = (idx % 3 - 1) * 8;
    const r = planetR + spreadOffset;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const symbol = PLANET_SYMBOLS[planet.name] || planet.name[0];
    const color = PLANET_COLORS[planet.name] || '#7f5af0';
    return { x, y, symbol, color, retrograde: planet.retrograde, name: planet.name, planet };
  });

  const handlePlanetClick = (planet: Planet) => {
    if (onPlanetClick) {
      onPlanetClick(planet);
    }
  };

  const handleSignClick = (signName: string) => {
    if (onSignClick) {
      onSignClick(signName);
    }
  };

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      style={{ width: '100%', maxWidth: size, height: 'auto' }}
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={outerR} fill="rgba(0,0,0,0.3)" stroke="rgba(127,90,240,0.3)" strokeWidth="1" />
      
      {/* Sign ring */}
      <circle cx={cx} cy={cy} r={signR} fill="none" stroke="rgba(127,90,240,0.2)" strokeWidth="1" />
      
      {/* House ring */}
      <circle cx={cx} cy={cy} r={houseR} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      
      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={innerR} fill="rgba(0,0,0,0.5)" stroke="rgba(127,90,240,0.3)" strokeWidth="1" />

      {/* House lines */}
      {houseLines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ))}

      {/* Ascendant marker */}
      <line
        x1={cx - outerR}
        y1={cy}
        x2={cx - houseR + 5}
        y2={cy}
        stroke="#7f5af0"
        strokeWidth="2"
      />
      <text x={cx - outerR + 5} y={cy - 5} fill="#7f5af0" fontSize="10" fontWeight="bold">ASC</text>

      {/* Sign symbols - clickable */}
      {signPositions.map((pos, i) => (
        <g 
          key={i} 
          style={{ cursor: onSignClick ? 'pointer' : 'default' }}
          onClick={() => handleSignClick(pos.name)}
        >
          <circle
            cx={pos.x}
            cy={pos.y}
            r="14"
            fill="transparent"
          />
          <text
            x={pos.x}
            y={pos.y}
            fill="rgba(255,255,255,0.6)"
            fontSize="14"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ 
              transition: 'fill 0.2s',
              pointerEvents: 'none',
            }}
          >
            {pos.symbol}
          </text>
        </g>
      ))}

      {/* Planets - clickable */}
      {planetPositions.map((pos, i) => (
        <g 
          key={i}
          style={{ cursor: onPlanetClick ? 'pointer' : 'default' }}
          onClick={() => handlePlanetClick(pos.planet)}
        >
          <circle
            cx={pos.x}
            cy={pos.y}
            r="14"
            fill="rgba(0,0,0,0.7)"
            stroke={pos.color}
            strokeWidth="1.5"
            style={{ 
              transition: 'all 0.2s',
            }}
          />
          <circle
            cx={pos.x}
            cy={pos.y}
            r="14"
            fill="transparent"
            stroke="transparent"
            strokeWidth="3"
            className="planet-hitarea"
          />
          <text
            x={pos.x}
            y={pos.y}
            fill={pos.color}
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ pointerEvents: 'none' }}
          >
            {pos.symbol}
          </text>
          {pos.retrograde && (
            <text
              x={pos.x + 10}
              y={pos.y - 8}
              fill="#ff6b6b"
              fontSize="8"
              style={{ pointerEvents: 'none' }}
            >
              R
            </text>
          )}
        </g>
      ))}

      {/* Center text */}
      <text
        x={cx}
        y={cy}
        fill="rgba(255,255,255,0.5)"
        fontSize="10"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        本命盤
      </text>

      {/* Hover hint */}
      {(onPlanetClick || onSignClick) && (
        <text
          x={cx}
          y={size - 8}
          fill="rgba(255,255,255,0.3)"
          fontSize="9"
          textAnchor="middle"
        >
          點擊行星或星座查看詳情
        </text>
      )}

      {/* Styles for hover effects */}
      <style>{`
        g:hover circle[stroke]:not(.planet-hitarea) {
          stroke-width: 2.5;
          filter: drop-shadow(0 0 4px currentColor);
        }
        g:hover text[fill="rgba(255,255,255,0.6)"] {
          fill: rgba(255,255,255,0.9);
        }
      `}</style>
    </svg>
  );
}
