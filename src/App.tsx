import { useState } from 'react';
import { FortuneForm } from './components/FortuneForm';
import { MasterReading } from './components/MasterReading';
import { DebateSection } from './components/DebateSection';
import { ConsensusResult } from './components/ConsensusResult';
import { consultFortune } from './api/fortune';
import type { FortuneRequest, FortuneResponse } from './types/fortune';
import './App.css';

type Stage = 'form' | 'loading' | 'readings' | 'debate' | 'consensus';

function App() {
  const [stage, setStage] = useState<Stage>('form');
  const [result, setResult] = useState<FortuneResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (request: FortuneRequest) => {
    setStage('loading');
    setError(null);

    try {
      const response = await consultFortune(request);
      setResult(response);
      setStage('readings');
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
      setStage('form');
    }
  };

  const handleNext = () => {
    if (stage === 'readings') setStage('debate');
    else if (stage === 'debate') setStage('consensus');
  };

  const handleReset = () => {
    setStage('form');
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header>
        <h1>🔮 算命擂台</h1>
        <p className="subtitle">四大流派命理大師同台較勁，看誰能算準你的命</p>
        
        {stage === 'form' && (
          <div className="masters-preview">
            <span className="master-tag">🌟 西洋占星</span>
            <span className="master-tag">🎴 塔羅牌</span>
            <span className="master-tag">🏯 紫微斗數</span>
            <span className="master-tag">📿 八字命理</span>
          </div>
        )}
      </header>

      <main>
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {stage === 'form' && (
          <FortuneForm onSubmit={handleSubmit} isLoading={false} />
        )}

        {stage === 'loading' && (
          <div className="loading">
            <div className="loading-spinner" />
            <h2>🔮 大師們正在會診中...</h2>
            <p>西洋占星、紫微斗數、八字、塔羅牌，四大流派正在激烈討論</p>
          </div>
        )}

        {stage === 'readings' && result && (
          <div className="stage-readings">
            <h2>📖 各大師的解讀</h2>
            <p className="question-display">「{result.question}」</p>
            
            <div className="readings-grid">
              {result.readings.map((reading) => (
                <MasterReading key={reading.master.id} reading={reading} />
              ))}
            </div>

            <button onClick={handleNext} className="next-btn">
              ⚔️ 看大師們辯論 →
            </button>
          </div>
        )}

        {stage === 'debate' && result && (
          <div className="stage-debate">
            <DebateSection debate={result.debate} />
            
            <button onClick={handleNext} className="next-btn">
              🤝 看最終共識 →
            </button>
          </div>
        )}

        {stage === 'consensus' && result && (
          <div className="stage-consensus">
            <ConsensusResult consensus={result.consensus} />
            
            <button onClick={handleReset} className="reset-btn">
              🔄 再問一個問題
            </button>
          </div>
        )}
      </main>

      <footer>
        <p>算命擂台 · SelfKit.art</p>
        <p className="disclaimer-small">
          僅供娛樂，不構成任何專業建議
        </p>
      </footer>
    </div>
  );
}

export default App;
