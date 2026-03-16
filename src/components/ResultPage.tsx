import React from 'react';
import { useTranslation } from 'react-i18next';
import { type UserData } from '../types';
import { type FortuneResult } from '../utils/lotto';
import { calculateSaju, getElementColor, getLuckyNumbersWithMeaning } from '../utils/saju';

interface ResultPageProps {
  user: UserData;
  fortune: FortuneResult;
  prevScore: number | null;
  countdown: string;
  onReset: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ user, fortune, prevScore, countdown, onReset }) => {
  const { t } = useTranslation();
  const saju = calculateSaju(user.birth, user.birthTime, user.gender as 'male' | 'female');
  const specialNumbers = getLuckyNumbersWithMeaning(saju);

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
      {/* 💰 AdSense Placement: Top (High Visibility) */}
      <div className="adsense-container top">
        ADVERTISEMENT
      </div>

      <div style={{textAlign: 'center', color: 'var(--primary-green)', fontWeight: 800, marginBottom: '24px', fontSize: '18px'}}>
        ✨ {t('result.report_title', { name: user.nickname || 'Guest' })}
      </div>

      {/* 사주팔자 섹션 */}
      <div style={{ 
        backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '25px',
        border: '1px solid #eee'
      }}>
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginBottom: '10px', fontWeight: 600 }}>
          {t('result.saju_title')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <PillarBox title="時" stem={saju.heavenlyStems[3]} branch={saju.earthlyBranches[3]} />
          <PillarBox title="日" stem={saju.heavenlyStems[2]} branch={saju.earthlyBranches[2]} />
          <PillarBox title="月" stem={saju.heavenlyStems[1]} branch={saju.earthlyBranches[1]} />
          <PillarBox title="年" stem={saju.heavenlyStems[0]} branch={saju.earthlyBranches[0]} />
        </div>
      </div>

      {/* 🌟 사주로 풀이한 5대 행운수 */}
      <div style={{ 
        backgroundColor: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '25px',
        border: '1px solid #e0f2f1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#00796b', marginBottom: '15px', fontWeight: 700 }}>
          {t('result.lucky_numbers_title')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {specialNumbers.map((item) => (
            <div key={item.type} style={{ 
              display: 'flex', alignItems: 'center', backgroundColor: '#fdfdfd', 
              padding: '8px 12px', borderRadius: '8px', border: '1px solid #f0f0f0'
            }}>
              <div style={{ 
                width: '6px', height: '24px', 
                backgroundColor: getElementColor(item.type === 'wood' ? '甲' : item.type === 'fire' ? '丙' : item.type === 'earth' ? '戊' : item.type === 'metal' ? '庚' : '壬'),
                borderRadius: '3px', marginRight: '10px'
              }}></div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#444', marginRight: '5px' }}>{t(`result.${item.type}`)}</span>
                <span style={{ fontSize: '11px', color: '#999' }}>{t(`result.${item.type}_desc`)}</span>
              </div>
              <div style={{ 
                width: '28px', height: '28px', backgroundColor: '#455a64', color: '#fff', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '14px'
              }}>
                {item.number}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="score-circle">
        <span className="score-label">{t('result.score_label')}</span>
        <span className="score-value">{fortune.totalScore + fortune.dailyFluctuation}</span>
        <span className="score-percentile">{t('result.percentile', { value: fortune.percentile })}</span>
      </div>

      <div className="history-compare">
        {prevScore !== null ? (
          <>
            {t('result.compare_last_week')}{' '}
            {fortune.totalScore - prevScore > 0 ? (
              <span className="history-up">▲ {fortune.totalScore - prevScore}</span>
            ) : fortune.totalScore - prevScore < 0 ? (
              <span className="history-down">▼ {Math.abs(fortune.totalScore - prevScore)}</span>
            ) : 'No change'}
          </>
        ) : t('result.no_history')}
      </div>

      <div className="grid-fortune">
        <div className="fortune-item">💰 {t('result.wealth')} {fortune.scores.wealth}</div>
        <div className="fortune-item">❤️ {t('result.love')} {fortune.scores.love}</div>
        <div className="fortune-item">💼 {t('result.work')} {fortune.scores.work}</div>
        <div className="fortune-item">🏥 {t('result.health')} {fortune.scores.health}</div>
      </div>

      <div style={{textAlign: 'center', margin: '20px 0', fontSize: '14px'}}>
        <span style={{fontWeight: 700, color: '#444'}}>{t('result.lucky_color')} </span>
        <span style={{
          display: 'inline-block', width: '20px', height: '20px', 
          backgroundColor: fortune.luckyColor, borderRadius: '50%', 
          verticalAlign: 'middle', marginLeft: '6px',
          border: '1px solid rgba(0,0,0,0.1)'
        }}></span>
      </div>

      <div className="lotto-section">
        <div className="lotto-title">{t('result.lotto_recommend_title')}</div>
        <p style={{textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '20px'}}>
          {t('result.lotto_recommend_desc')}
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
        <div className="countdown-label">{t('result.countdown_label')}</div>
        <div className="countdown-time">{countdown}</div>
      </div>

      {/* 💰 AdSense Placement: Bottom (Final Engagement) */}
      <div className="adsense-container bottom">
        ADVERTISEMENT
      </div>
      
      <button className="reset-button" onClick={onReset}>
        {t('common.reset')}
      </button>
    </div>
  );
};

export default ResultPage;
