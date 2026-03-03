import React, { useState, useEffect } from 'react';
import './App.css';
import { getWeekId, generateWeeklyFortune, FortuneResult } from './utils/lotto';
import { UserData } from './types';
import LandingPage from './components/LandingPage';
import ResultPage from './components/ResultPage';

function App() {
  const [view, setView] = useState<'landing' | 'result'>('landing');
  const [user, setUser] = useState<UserData>({
    nickname: '',
    birth: '',
    gender: 'male',
    birthTime: '',
  });
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const [countdown, setCountdown] = useState('');

  // 1. 초기 로드 시 데이터 로드 및 해시 감지
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedPrevScore = localStorage.getItem('prev_week_score');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      const currentWeekId = getWeekId();
      const lastWeekId = localStorage.getItem('last_week_id');
      
      if (lastWeekId && lastWeekId !== currentWeekId) {
        setPrevScore(savedPrevScore ? Number(savedPrevScore) : null);
      }
      
      const result = generateWeeklyFortune(parsedUser.birth + parsedUser.birthTime, parsedUser.gender, currentWeekId);
      setFortune(result);
      // 여기서 setView('result')를 자동으로 하지 않아 첫 로딩은 항상 landing이 됩니다.
    }

    const handleHashChange = () => {
      if (window.location.hash === '#result') {
        // 결과 데이터가 있는 경우에만 결과 뷰로 이동
        if (localStorage.getItem('user_data')) {
          setView('result');
        } else {
          window.location.hash = '';
          setView('landing');
        }
      } else {
        setView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // 초기 로드 시 해시가 있으면 대응
    if (window.location.hash === '#result' && localStorage.getItem('user_data')) {
      setView('result');
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. 다음 토요일 오전 6시 카운트다운 타이머
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
    localStorage.setItem('user_data', JSON.stringify(user));
    
    const currentWeekId = getWeekId();
    localStorage.setItem('last_week_id', currentWeekId);
    
    const result = generateWeeklyFortune(user.birth + user.birthTime, user.gender, currentWeekId);
    setFortune(result);
    localStorage.setItem('prev_week_score', result.totalScore.toString());
    
    setView('result');
    window.location.hash = 'result'; // 해시 업데이트하여 결과 페이지임을 표시
  };

  const handleReset = () => {
    if (window.confirm('입력된 정보를 초기화할까요?')) {
      localStorage.removeItem('user_data');
      localStorage.removeItem('last_week_id');
      window.location.hash = '';
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
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
