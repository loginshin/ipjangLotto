import React from 'react';
import { type UserData } from '../types';
import { type FortuneResult } from '../utils/lotto';
import { calculateSaju, getElementColor } from '../utils/saju';

interface ResultPageProps {
  user: UserData;
  fortune: FortuneResult;
  prevScore: number | null;
  countdown: string;
  onReset: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ user, fortune, prevScore, countdown, onReset }) => {
  const saju = calculateSaju(user.birth, user.birthTime, user.gender as 'male' | 'female');

  const PillarBox = ({ title, stem, branch }: { title: string, stem: string, branch: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '10px', color: '#888' }}>{title}</span>
      <div style={{ 
        width: '40px', height: '40px', backgroundColor: getElementColor(stem), 
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '4px', fontWeight: 800, fontSize: '20px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      }}>
        {stem}
      </div>
      <div style={{ 
        width: '40px', height: '40px', backgroundColor: getElementColor(branch), 
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '4px', fontWeight: 800, fontSize: '20px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      }}>
        {branch}
      </div>
    </div>
  );

  return (
    <div className="card">
      <div style={{textAlign: 'center', color: 'var(--primary-green)', fontWeight: 800, marginBottom: '24px', fontSize: '18px'}}>
        ✨ {user.nickname || '익명'}님의 주간 리포트
      </div>

      {/* 사주팔자 섹션 */}
      <div style={{ 
        backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '25px',
        border: '1px solid #eee'
      }}>
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginBottom: '10px', fontWeight: 600 }}>
          나의 타고난 사주팔자 (四柱八字)
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <PillarBox title="시(時)" stem={saju.heavenlyStems[3]} branch={saju.earthlyBranches[3]} />
          <PillarBox title="일(日)" stem={saju.heavenlyStems[2]} branch={saju.earthlyBranches[2]} />
          <PillarBox title="월(月)" stem={saju.heavenlyStems[1]} branch={saju.earthlyBranches[1]} />
          <PillarBox title="년(年)" stem={saju.heavenlyStems[0]} branch={saju.earthlyBranches[0]} />
        </div>
      </div>
      
      <div className="score-circle">
        <span className="score-label">이번 주 운 점수</span>
        <span className="score-value">{fortune.totalScore + fortune.dailyFluctuation}</span>
        <span className="score-percentile">전국 상위 {fortune.percentile}%</span>
      </div>

      <div className="history-compare">
        {prevScore !== null ? (
          <>
            지난주 대비: {' '}
            {fortune.totalScore - prevScore > 0 ? (
              <span className="history-up">▲ {fortune.totalScore - prevScore}</span>
            ) : fortune.totalScore - prevScore < 0 ? (
              <span className="history-down">▼ {Math.abs(fortune.totalScore - prevScore)}</span>
            ) : '변동 없음'}
          </>
        ) : '첫 번째 운세 분석입니다!'}
      </div>

      <div className="grid-fortune">
        <div className="fortune-item">💰 재물 {fortune.scores.wealth}</div>
        <div className="fortune-item">❤️ 애정 {fortune.scores.love}</div>
        <div className="fortune-item">💼 직장 {fortune.scores.work}</div>
        <div className="fortune-item">🏥 건강 {fortune.scores.health}</div>
      </div>

      <div style={{textAlign: 'center', margin: '20px 0', fontSize: '14px'}}>
        <span style={{fontWeight: 700, color: '#444'}}>이번 주 행운 컬러: </span>
        <span style={{
          display: 'inline-block', width: '20px', height: '20px', 
          backgroundColor: fortune.luckyColor, borderRadius: '50%', 
          verticalAlign: 'middle', marginLeft: '6px',
          border: '1px solid rgba(0,0,0,0.1)'
        }}></span>
      </div>

      <div className="lotto-section">
        <div className="lotto-title">💎 이번 주 추천 번호</div>
        <p style={{textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '20px'}}>
          사주 데이터와 이번 주 운세를 분석하여 추출된 단 한 세트의 번호입니다.
        </p>
        {fortune.lottoSets.map((set, idx) => (
          <div key={idx} className="lotto-set">
            <div className="lotto-number-container">
              {set.map(num => <div key={num} className="lotto-ball">{num}</div>)}
            </div>
          </div>
        ))}
      </div>

      <div className="countdown-container">
        <div className="countdown-label">다음 운세 업데이트까지</div>
        <div className="countdown-time">{countdown}</div>
      </div>
      
      <button className="reset-button" onClick={onReset}>
        정보 수정 및 초기화
      </button>
    </div>
  );
};

export default ResultPage;
