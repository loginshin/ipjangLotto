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

  // 1. 초기 로드 시 기존 데이터 확인 및 자동 결과 표시
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedPrevScore = localStorage.getItem('prev_week_score');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // 주차 정보 확인
      const currentWeekId = getWeekId();
      const lastWeekId = localStorage.getItem('last_week_id');
      
      // 주차가 바뀌었으면 이전 점수를 prevScore로 설정
      if (lastWeekId && lastWeekId !== currentWeekId) {
        setPrevScore(savedPrevScore ? Number(savedPrevScore) : null);
      }
      
      const result = generateWeeklyFortune(parsedUser.birth + parsedUser.birthTime, parsedUser.gender, currentWeekId);
      setFortune(result);
      setView('result');
      
      // 현재 주차 정보 업데이트
      localStorage.setItem('last_week_id', currentWeekId);
    }
  }, []);

  // 2. 다음 토요일 오전 6시 카운트다운 타이머
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      
      // 다음 토요일 06시 계산
      let target = new Date();
      target.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
      target.setHours(6, 0, 0, 0);
      
      // 이미 이번주 토요일 6시가 지났으면 다음주 토요일로
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
  };

  const handleReset = () => {
    if (window.confirm('입력된 정보를 초기화할까요?')) {
      localStorage.removeItem('user_data');
      localStorage.removeItem('last_week_id');
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
