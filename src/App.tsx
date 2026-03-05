import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getWeekId, generateWeeklyFortune } from './utils/lotto';
import { validateUserData } from './utils/validation';
import { storage } from './utils/storage';
import { type FortuneResult } from './utils/lotto';
import { type UserData } from './types';
import LandingPage from './components/LandingPage';
import ResultPage from './components/ResultPage';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [view, setView] = useState<'landing' | 'result'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [user, setUser] = useState<UserData>({
    nickname: '',
    birth: '',
    gender: 'male',
    birthTime: '',
  });
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const [countdown, setCountdown] = useState('');

  const loadData = useCallback(() => {
    const savedUser = storage.getUserData();
    const savedPrevScore = storage.getPrevWeekScore();
    
    if (savedUser) {
      setUser(savedUser);
      
      const currentWeekId = getWeekId();
      const lastWeekId = storage.getLastWeekId();
      
      if (lastWeekId && lastWeekId !== currentWeekId) {
        setPrevScore(savedPrevScore);
      }
      
      const result = generateWeeklyFortune(savedUser.birth, savedUser.gender, currentWeekId, savedUser.birthTime);
      setFortune(result);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleHashChange = () => {
      const isResultHash = window.location.hash === '#result';
      const hasUserData = !!storage.getUserData();

      if (isResultHash && hasUserData) {
        setView('result');
      } else {
        if (isResultHash) window.location.hash = '';
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '#result' && storage.getUserData()) {
      setView('result');
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [loadData]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let target = new Date();
      target.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
      target.setHours(6, 0, 0, 0);
      
      if (now.getTime() >= target.getTime()) {
        target.setDate(target.getDate() + 7);
      }

      const diff = target.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setCountdown(`${d}일 ${h}시간 ${m}분 ${s}초`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateUserData(user);
    if (!isValid) {
      alert(errors.join('\n'));
      return;
    }

    setIsLoading(true);
    const messages = [t('common.loading_sub1'), t('common.loading_sub2'), t('common.loading_sub3')];
    let msgIdx = 0;
    setLoadingMsg(messages[0]);

    const msgTimer = setInterval(() => {
      msgIdx++;
      if (msgIdx < messages.length) {
        setLoadingMsg(messages[msgIdx]);
      }
    }, 1100);

    setTimeout(() => {
      clearInterval(msgTimer);
      storage.setUserData(user);
      
      const currentWeekId = getWeekId();
      storage.setLastWeekId(currentWeekId);
      
      const result = generateWeeklyFortune(user.birth, user.gender, currentWeekId, user.birthTime);
      setFortune(result);
      storage.setPrevWeekScore(result.totalScore);
      
      setIsLoading(false);
      setView('result');
      window.location.hash = 'result';
    }, 3800);
  };

  const handleReset = () => {
    if (window.confirm('입력된 정보를 초기화할까요?')) {
      storage.clear();
      window.location.hash = '';
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loader"></div>
            <h2 className="loading-title">{t('common.loading')}</h2>
            <p className="loading-sub">{loadingMsg}</p>
            
            {/* 💰 AdSense Interstitial Placeholder */}
            <div className="adsense-interstitial" style={{ 
              marginTop: '40px', width: '100%', minHeight: '300px', 
              backgroundColor: '#fff', borderRadius: '15px', display: 'flex', 
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              color: '#999', fontSize: '12px', border: '1px solid #eee',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              padding: '20px', boxSizing: 'border-box'
            }}>
              <span style={{marginBottom: '10px', fontSize: '10px', opacity: 0.5}}>ADVERTISEMENT</span>
              <div style={{width: '100%', flex: 1, backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 AD GOES HERE
              </div>
              <p style={{marginTop: '15px', fontSize: '11px', color: '#666', fontWeight: 500}}>{t('common.loading_ad_notice')}</p>
            </div>
          </div>
        </div>
      )}

      {view === 'landing' ? (
        <LandingPage 
          user={user} 
          setUser={setUser} 
          onSubmit={handleSubmit} 
        />
      ) : (
        fortune && (
          <ResultPage 
            user={user} 
            fortune={fortune} 
            prevScore={prevScore} 
            countdown={countdown} 
            onReset={handleReset} 
          />
        )
      )}

      <footer className="app-footer">
        <p className="footer-text">
          서비스 이용 중 불편사항이나 기능 제안은 아래로 연락주세요.<br/>
          <a href="mailto:loginshin3@gmail.com" className="footer-link">
            ✉️ loginshin3@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
