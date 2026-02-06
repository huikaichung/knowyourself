'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getManualDetail, type DetailSystem, type DetailResponse } from '@/lib/api';
import styles from './DetailPage.module.css';

interface Props {
  manualId: string;
}

const SYSTEMS: { key: DetailSystem; label: string }[] = [
  { key: 'western', label: '西洋占星' },
  { key: 'bazi', label: '八字命理' },
  { key: 'ziwei', label: '紫微斗數' },
  { key: 'human_design', label: '人類圖' },
  { key: 'meihua', label: '梅花易數' },
];

const LOADING_HINTS: Record<string, string> = {
  western: '推算行星位置與相位...',
  bazi: '排列四柱八字與十神...',
  ziwei: '安星佈局十二宮...',
  human_design: '計算能量中心與通道...',
  meihua: '起卦分析體用關係...',
};

export function DetailPage({ manualId }: Props) {
  const [results, setResults] = useState<Record<string, { data?: DetailResponse; loading: boolean; error?: string }>>({});

  const completed = Object.values(results).filter(r => !r.loading).length;
  const total = SYSTEMS.length;

  useEffect(() => {
    // Init all as loading
    const init: typeof results = {};
    SYSTEMS.forEach(s => { init[s.key] = { loading: true }; });
    setResults(init);

    // Fire all in parallel
    SYSTEMS.forEach(({ key }) => {
      getManualDetail(manualId, key)
        .then(data => {
          setResults(prev => ({ ...prev, [key]: { data, loading: false } }));
        })
        .catch(err => {
          setResults(prev => ({ ...prev, [key]: { loading: false, error: err.message } }));
        });
    });
  }, [manualId]);

  return (
    <div className={styles.page}>
      <div className={styles.meshBg}><div className={styles.orbPurple} /></div>

      <header className={styles.header}>
        <Link href={`/manual/${manualId}`} className={styles.back}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          返回說明書
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>詳細解讀</h1>
          <p className={styles.subtitle}>
            {completed < total 
              ? `正在深度解讀中 · ${completed}/${total} 完成`
              : '五大系統的完整命盤分析'
            }
          </p>
          {completed === 0 && (
            <p className={styles.loadingHint}>每個系統約需 5-10 秒，請稍候</p>
          )}
        </div>

        {SYSTEMS.map(({ key, label }) => {
          const state = results[key];
          if (!state) return null;

          if (state.loading) {
            return (
              <section key={key} className={styles.card}>
                <h2 className={styles.cardTitle}>{label}</h2>
                <div className={styles.cardLoading}>
                  <div className={styles.loadingHeader}>
                    <div className={styles.loadingDot} />
                    <span>{LOADING_HINTS[key] || '正在解讀...'}</span>
                  </div>
                  <div>
                    <div className={`${styles.skeleton} ${styles.skeletonPill}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonPill}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonPill}`} />
                  </div>
                  <div>
                    <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                  </div>
                </div>
              </section>
            );
          }

          if (state.error) {
            return (
              <section key={key} className={styles.card}>
                <h2 className={styles.cardTitle}>{label}</h2>
                <p className={styles.cardError}>載入失敗：{state.error}</p>
              </section>
            );
          }

          const d = state.data?.data as Record<string, unknown>;
          if (!d) return null;

          return (
            <section key={key} className={`${styles.card} ${styles.cardReady}`}>
              <h2 className={styles.cardTitle}>{label}</h2>
              {key === 'western' && <WesternRender data={d} />}
              {key === 'bazi' && <BaziRender data={d} />}
              {key === 'ziwei' && <ZiweiRender data={d} />}
              {key === 'human_design' && <HumanDesignRender data={d} />}
              {key === 'meihua' && <MeihuaRender data={d} />}
            </section>
          );
        })}

        <p className={styles.disclaimer}>
          以上為 AI 根據出生資訊的推估結果，精確解讀建議使用專業軟體或諮詢專業命理師
        </p>

        <div className={styles.backAction}>
          <Link href={`/manual/${manualId}`} className="btn btn-ghost">返回說明書</Link>
        </div>
      </main>
    </div>
  );
}

/* ========== RENDER HELPERS ========== */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WesternRender({ data }: { data: any }) {
  const asc = data.ascendant;
  const mc = data.midheaven;
  const planets = data.planets || [];
  const aspects = data.aspects || [];

  return (
    <div className={styles.systemContent}>
      {/* Ascendant + MC */}
      <div className={styles.subSection}>
        <h3>基本軸點</h3>
        <div className={styles.rowPair}>
          {asc && <DataPill label="上升星座" value={`${asc.sign} ${asc.degree || ''}`} />}
          {mc && <DataPill label="天頂 MC" value={`${mc.sign} ${mc.degree || ''}`} />}
        </div>
      </div>

      {/* Planets */}
      <div className={styles.subSection}>
        <h3>行星位置</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>行星</th><th>星座</th><th>度數</th><th>宮位</th><th>逆行</th></tr>
            </thead>
            <tbody>
              {planets.map((p: Record<string, unknown>, i: number) => (
                <tr key={i}>
                  <td className={styles.tdBold}>{p.name as string}</td>
                  <td>{p.sign as string}</td>
                  <td>{p.degree as string}</td>
                  <td>第 {p.house as number} 宮</td>
                  <td>{p.retrograde ? 'R' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {planets.map((p: Record<string, unknown>, i: number) => (
          p.interpretation ? <p key={i} className={styles.interpLine}><strong>{p.name as string}</strong>：{p.interpretation as string}</p> : null
        ))}
      </div>

      {/* Aspects */}
      <div className={styles.subSection}>
        <h3>主要相位</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>行星 1</th><th>相位</th><th>行星 2</th><th>容許度</th></tr>
            </thead>
            <tbody>
              {aspects.map((a: Record<string, unknown>, i: number) => (
                <tr key={i}>
                  <td>{a.planet1 as string}</td>
                  <td className={styles.tdBold}>{a.type as string}</td>
                  <td>{a.planet2 as string}</td>
                  <td>{a.orb as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {aspects.map((a: Record<string, unknown>, i: number) => (
          a.interpretation ? <p key={i} className={styles.interpLine}><strong>{a.planet1 as string} {a.type as string} {a.planet2 as string}</strong>：{a.interpretation as string}</p> : null
        ))}
      </div>

      {data.stelliums && <Para label="群星聚集" text={data.stelliums} />}
      {data.chart_pattern && <Para label="星盤格局" text={data.chart_pattern} />}
      {data.dominant_element && <Para label="主導元素" text={data.dominant_element} />}
      {data.summary && <Para label="總結" text={data.summary} />}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BaziRender({ data }: { data: any }) {
  const pillars = data.pillars || {};
  const dm = data.day_master || {};
  const fe = data.five_elements || {};
  const tg = data.ten_gods || [];
  const ug = data.useful_god || {};
  const uf = data.unfavorable || {};
  const dy = data.da_yun || [];

  return (
    <div className={styles.systemContent}>
      {/* Four Pillars */}
      <div className={styles.subSection}>
        <h3>四柱八字</h3>
        <div className={styles.pillarsGrid}>
          {['year', 'month', 'day', 'hour'].map(key => {
            const p = pillars[key];
            if (!p) return null;
            const labels: Record<string, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
            return (
              <div key={key} className={styles.pillarCard}>
                <span className={styles.pillarLabel}>{labels[key]}</span>
                <span className={styles.pillarStemBranch}>{p.stem}{p.branch}</span>
                <span className={styles.pillarHidden}>藏干：{(p.hidden_stems || []).join('、')}</span>
                {p.nayin && <span className={styles.pillarNayin}>納音：{p.nayin}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Master */}
      <div className={styles.subSection}>
        <h3>日主分析</h3>
        <div className={styles.rowPair}>
          <DataPill label="日主" value={dm.element || ''} />
          <DataPill label="強弱" value={dm.strength || ''} />
        </div>
        {dm.analysis && <p className={styles.analysis}>{dm.analysis}</p>}
      </div>

      {/* Five Elements */}
      <div className={styles.subSection}>
        <h3>五行分布</h3>
        <div className={styles.elementsRow}>
          {['木', '火', '土', '金', '水'].map(el => (
            <div key={el} className={styles.elementItem}>
              <span className={styles.elementName}>{el}</span>
              <span className={styles.elementCount}>{fe[el] ?? 0}</span>
            </div>
          ))}
        </div>
        {fe.analysis && <p className={styles.analysis}>{fe.analysis}</p>}
      </div>

      {/* Ten Gods */}
      {tg.length > 0 && (
        <div className={styles.subSection}>
          <h3>十神</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>十神</th><th>位置</th><th>柱位</th></tr></thead>
              <tbody>
                {tg.map((g: Record<string, unknown>, i: number) => (
                  <tr key={i}>
                    <td className={styles.tdBold}>{g.god as string}</td>
                    <td>{g.stem_or_branch as string}</td>
                    <td>{g.pillar as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tg.map((g: Record<string, unknown>, i: number) => (
            g.interpretation ? <p key={i} className={styles.interpLine}><strong>{g.god as string}</strong>：{g.interpretation as string}</p> : null
          ))}
        </div>
      )}

      {/* Useful God */}
      {ug.god && (
        <div className={styles.subSection}>
          <h3>用神與忌神</h3>
          <div className={styles.rowPair}>
            <DataPill label="用神" value={`${ug.god}（${ug.element || ''}）`} />
            {uf.element && <DataPill label="忌神" value={uf.element} />}
          </div>
          {ug.reasoning && <p className={styles.analysis}>{ug.reasoning}</p>}
          {uf.reasoning && <p className={styles.analysis}>{uf.reasoning}</p>}
        </div>
      )}

      {/* Da Yun */}
      {dy.length > 0 && (
        <div className={styles.subSection}>
          <h3>大運</h3>
          {dy.map((d: Record<string, unknown>, i: number) => (
            <div key={i} className={styles.daYunRow}>
              <span className={styles.daYunAge}>{d.age_range as string}</span>
              <span className={styles.daYunSB}>{d.stem_branch as string}</span>
              <span className={styles.daYunInterp}>{d.interpretation as string}</span>
            </div>
          ))}
        </div>
      )}

      {data.summary && <Para label="總結" text={data.summary} />}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ZiweiRender({ data }: { data: any }) {
  const info = data.ming_pan_info || {};
  const palaces = data.palaces || [];

  return (
    <div className={styles.systemContent}>
      <div className={styles.subSection}>
        <h3>命盤基本資訊</h3>
        {data.lunar_date && <DataPill label="農曆" value={data.lunar_date} />}
        <div className={styles.rowPair}>
          {info.yin_yang && <DataPill label="陰陽" value={info.yin_yang} />}
          {info.wu_xing_ju && <DataPill label="五行局" value={info.wu_xing_ju} />}
          {info.ming_zhu && <DataPill label="命主" value={info.ming_zhu} />}
          {info.shen_zhu && <DataPill label="身主" value={info.shen_zhu} />}
        </div>
      </div>

      {/* Palaces */}
      <div className={styles.subSection}>
        <h3>十二宮</h3>
        {palaces.map((p: Record<string, unknown>, i: number) => (
          <div key={i} className={styles.palaceBlock}>
            <div className={styles.palaceHeader}>
              <span className={styles.palaceName}>{p.name as string}</span>
              <span className={styles.palaceBranch}>{p.branch as string}</span>
            </div>
            <div className={styles.palaceStars}>
              {((p.major_stars as string[]) || []).length > 0 && (
                <span className={styles.majorStars}>主星：{(p.major_stars as string[]).join('、')}</span>
              )}
              {((p.minor_stars as string[]) || []).length > 0 && (
                <span className={styles.minorStars}>輔星：{(p.minor_stars as string[]).join('、')}</span>
              )}
              {((p.si_hua as string[]) || []).length > 0 && (
                <span className={styles.siHua}>四化：{(p.si_hua as string[]).join('、')}</span>
              )}
            </div>
            {p.interpretation ? <p className={styles.palaceInterp}>{String(p.interpretation)}</p> : null}
          </div>
        ))}
      </div>

      {data.key_patterns && <Para label="關鍵格局" text={data.key_patterns} />}
      {data.summary && <Para label="總結" text={data.summary} />}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HumanDesignRender({ data }: { data: any }) {
  const type = data.type || {};
  const strategy = data.strategy || {};
  const authority = data.authority || {};
  const profile = data.profile || {};
  const centers = data.centers || [];
  const channels = data.channels || [];
  const gates = data.key_gates || [];

  return (
    <div className={styles.systemContent}>
      {/* Core */}
      <div className={styles.subSection}>
        <h3>核心資訊</h3>
        <div className={styles.rowPair}>
          <DataPill label="類型" value={type.name || ''} />
          <DataPill label="策略" value={strategy.name || ''} />
          <DataPill label="內在權威" value={authority.name || ''} />
          <DataPill label="人生角色" value={profile.numbers || ''} />
        </div>
        {data.definition && <DataPill label="定義" value={data.definition} />}
        <div className={styles.rowPair}>
          {data.not_self_theme && <DataPill label="非自己主題" value={data.not_self_theme} />}
          {data.signature && <DataPill label="標記" value={data.signature} />}
        </div>
        {data.incarnation_cross && <p className={styles.analysis}>人生十字：{data.incarnation_cross}</p>}
        {type.description && <p className={styles.analysis}>{type.description}</p>}
        {strategy.description && <p className={styles.analysis}>{strategy.description}</p>}
        {authority.description && <p className={styles.analysis}>{authority.description}</p>}
        {profile.description && <p className={styles.analysis}>{profile.description}</p>}
      </div>

      {/* Centers */}
      {centers.length > 0 && (
        <div className={styles.subSection}>
          <h3>九大能量中心</h3>
          <div className={styles.centersGrid}>
            {centers.map((c: Record<string, unknown>, i: number) => (
              <div key={i} className={`${styles.centerItem} ${c.defined ? styles.centerDefined : styles.centerOpen}`}>
                <span className={styles.centerName}>{c.name as string}</span>
                <span className={styles.centerStatus}>{c.defined ? '有定義' : '開放'}</span>
                {c.interpretation ? <p className={styles.centerInterp}>{String(c.interpretation)}</p> : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Channels */}
      {channels.length > 0 && (
        <div className={styles.subSection}>
          <h3>通道</h3>
          {channels.map((ch: Record<string, unknown>, i: number) => (
            <div key={i} className={styles.channelRow}>
              <div className={styles.channelHeader}>
                <span className={styles.channelGates}>{ch.gate1 as number}-{ch.gate2 as number}</span>
                <span className={styles.channelName}>{ch.name as string}</span>
                <span className={styles.channelType}>{ch.type as string}</span>
              </div>
              {ch.interpretation ? <p className={styles.channelInterp}>{String(ch.interpretation)}</p> : null}
            </div>
          ))}
        </div>
      )}

      {/* Gates */}
      {gates.length > 0 && (
        <div className={styles.subSection}>
          <h3>重要閘門</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>閘門</th><th>名稱</th><th>爻</th><th>中心</th><th>懸掛</th></tr></thead>
              <tbody>
                {gates.map((g: Record<string, unknown>, i: number) => (
                  <tr key={i}>
                    <td className={styles.tdBold}>{g.number as number}</td>
                    <td>{g.name as string}</td>
                    <td>{g.line as number}</td>
                    <td>{g.center as string}</td>
                    <td>{g.hanging ? '是' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {gates.map((g: Record<string, unknown>, i: number) => (
            g.interpretation ? <p key={i} className={styles.interpLine}><strong>閘門 {g.number as number}</strong>：{g.interpretation as string}</p> : null
          ))}
        </div>
      )}

      {data.summary && <Para label="總結" text={data.summary} />}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MeihuaRender({ data }: { data: any }) {
  const deriv = data.derivation || {};
  const upper = data.upper_trigram || {};
  const lower = data.lower_trigram || {};
  const hex = data.hexagram || {};
  const cl = data.changing_line || {};
  const changed = data.changed_hexagram || {};
  const ty = data.ti_yong || {};
  const hu = data['互卦'] || data.hu_gua || {};

  return (
    <div className={styles.systemContent}>
      {/* Derivation */}
      <div className={styles.subSection}>
        <h3>起卦過程</h3>
        {deriv.method && <p className={styles.analysis}>{deriv.method}</p>}
      </div>

      {/* Trigrams */}
      <div className={styles.subSection}>
        <h3>卦象</h3>
        <div className={styles.rowPair}>
          <DataPill label="上卦" value={`${upper.name || ''} (${upper.element || ''})`} />
          <DataPill label="下卦" value={`${lower.name || ''} (${lower.element || ''})`} />
        </div>
        {hex.name && <DataPill label="本卦" value={`${hex.name}（第${hex.number || '?'}卦）`} />}
        {hex.gua_ci && <p className={styles.quoteBlock}>{hex.gua_ci}</p>}
        {hex.interpretation && <p className={styles.analysis}>{hex.interpretation}</p>}
      </div>

      {/* Changing line */}
      <div className={styles.subSection}>
        <h3>動爻（第 {cl.position || '?'} 爻）</h3>
        {cl.yao_ci && <p className={styles.quoteBlock}>{cl.yao_ci}</p>}
        {cl.interpretation && <p className={styles.analysis}>{cl.interpretation}</p>}
      </div>

      {/* Changed hexagram */}
      <div className={styles.subSection}>
        <h3>變卦</h3>
        {changed.name && <DataPill label="變卦" value={`${changed.name}（第${changed.number || '?'}卦）`} />}
        {changed.interpretation && <p className={styles.analysis}>{changed.interpretation}</p>}
      </div>

      {/* Ti-Yong */}
      <div className={styles.subSection}>
        <h3>體用分析</h3>
        <div className={styles.rowPair}>
          {ty.ti && <DataPill label="體卦" value={`${ty.ti} (${ty.ti_element || ''})`} />}
          {ty.yong && <DataPill label="用卦" value={`${ty.yong} (${ty.yong_element || ''})`} />}
          {ty.relationship && <DataPill label="體用關係" value={ty.relationship} />}
        </div>
        {ty.analysis && <p className={styles.analysis}>{ty.analysis}</p>}
      </div>

      {/* Hu gua */}
      {hu.name && (
        <div className={styles.subSection}>
          <h3>互卦</h3>
          <DataPill label="互卦" value={hu.name} />
          {hu.interpretation && <p className={styles.analysis}>{hu.interpretation}</p>}
        </div>
      )}

      {data.overall_reading && <Para label="綜合解讀" text={data.overall_reading} />}
      {data.life_advice && <Para label="建議" text={data.life_advice} />}
    </div>
  );
}

/* ========== SHARED COMPONENTS ========== */

function DataPill({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.dataPill}>
      <span className={styles.pillLabel}>{label}</span>
      <span className={styles.pillValue}>{value}</span>
    </div>
  );
}

function Para({ label, text }: { label: string; text: string }) {
  return (
    <div className={styles.paraBlock}>
      <h3>{label}</h3>
      <p>{text}</p>
    </div>
  );
}
