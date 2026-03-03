import React from 'react';
import { UserData } from '../types';

interface LandingPageProps {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ user, setUser, onSubmit }) => {
  return (
    <div className="card">
      <div className="hero-title">🌿 보타니컬 주간 운세</div>
      <p className="privacy-notice">
        당신의 생년월일을 기반으로 이번 주의 운세와<br/>
        행운의 로또 번호를 추출합니다.<br/>
        <span style={{fontSize: '10px', opacity: 0.8}}>(모든 정보는 기기에만 저장됩니다)</span>
      </p>
      
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label>닉네임 (선택)</label>
          <input 
            type="text" 
            placeholder="닉네임을 입력하세요" 
            value={user.nickname} 
            onChange={e => setUser({...user, nickname: e.target.value})} 
          />
        </div>
        <div className="input-group">
          <label>생년월일 (필수)</label>
          <input 
            type="date" 
            required 
            value={user.birth} 
            onChange={e => setUser({...user, birth: e.target.value})} 
          />
        </div>
        <div className="input-group">
          <label>태어난 시간 (선택)</label>
          <input 
            type="time" 
            value={user.birthTime} 
            onChange={e => setUser({...user, birthTime: e.target.value})} 
          />
        </div>
        <div className="input-group">
          <label>성별</label>
          <select value={user.gender} onChange={e => setUser({...user, gender: e.target.value})}>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <button type="submit" className="cta-button">이번 주 행운 확인하기</button>
      </form>
    </div>
  );
};

export default LandingPage;
