import React from 'react';
import { useTranslation } from 'react-i18next';
import { type UserData } from '../types';

interface LandingPageProps {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ user, setUser, onSubmit }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' }}>
        <button onClick={() => changeLanguage('ko')} style={{ fontSize: '10px', padding: '2px 6px', opacity: i18n.language === 'ko' ? 1 : 0.5 }}>KO</button>
        <button onClick={() => changeLanguage('en')} style={{ fontSize: '10px', padding: '2px 6px', opacity: i18n.language.startsWith('en') ? 1 : 0.5 }}>EN</button>
      </div>

      <h1 className="hero-title">{t('landing.title')}</h1>
      <p className="privacy-notice">
        {t('landing.subtitle')}<br/>
        <span style={{fontSize: '10px', opacity: 0.8}}>{t('landing.privacy')}</span>
      </p>
      
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label>{t('common.nickname')}</label>
          <input 
            type="text" 
            placeholder={t('common.nickname_placeholder')} 
            value={user.nickname} 
            onChange={e => setUser({...user, nickname: e.target.value})} 
          />
        </div>
        <div className="input-group">
          <label>{t('common.birth_date')}</label>
          <input 
            type="date" 
            required 
            value={user.birth} 
            onChange={e => setUser({...user, birth: e.target.value})} 
          />
        </div>
        <div className="input-group">
          <label>{t('common.birth_time')}</label>
          <input 
            type="time" 
            value={user.birthTime} 
            onChange={e => setUser({...user, birthTime: e.target.value})} 
          />
        </div>
        <div className="input-group">
          <label>{t('common.gender')}</label>
          <select value={user.gender} onChange={e => setUser({...user, gender: e.target.value})}>
            <option value="male">{t('common.male')}</option>
            <option value="female">{t('common.female')}</option>
          </select>
        </div>
        <button type="submit" className="cta-button">{t('common.submit')}</button>
      </form>

      {/* 🔮 분석 원리 설명 섹션 */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h3 style={{ fontSize: '15px', color: '#2e7d32', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>
          {t('landing.how_it_works_title')}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '22px', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '12px' }}>🧬</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#333' }}>{t('landing.saju_dna_title')}</div>
              <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                {t('landing.saju_dna_desc')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '22px', backgroundColor: '#fff3e0', padding: '10px', borderRadius: '12px' }}>🔢</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#333' }}>{t('landing.rule_5plus1_title')}</div>
              <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                {t('landing.rule_5plus1_desc')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '22px', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '12px' }}>📊</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#333' }}>{t('landing.report_title')}</div>
              <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                {t('landing.report_desc')}
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '25px', backgroundColor: '#f9fbe7', padding: '15px', 
          borderRadius: '12px', fontSize: '11px', color: '#558b2f', textAlign: 'center',
          lineHeight: '1.5', border: '1px solid #dcedc8'
        }}>
          {t('landing.quote')}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
