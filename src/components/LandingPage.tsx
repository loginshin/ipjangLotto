import React from 'react';
import { type UserData } from '../types';

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

      {/* 🔮 분석 원리 설명 섹션 */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h3 style={{ fontSize: '15px', color: '#2e7d32', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>
          🍀 입장로또의 행운 분석 원리
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '22px', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '12px' }}>🧬</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#333' }}>나만의 사주 DNA 분석</div>
              <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                생년월일시를 전통 명리학의 <strong>사주팔자(8글자)</strong>로 변환하여 당신이 타고난 고유한 기운의 지문을 생성합니다.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '22px', backgroundColor: '#fff3e0', padding: '10px', borderRadius: '12px' }}>🔢</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#333' }}>행운의 5 + 1 법칙</div>
              <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                사주 <strong>오행(목, 화, 토, 금, 수)</strong>에서 추출한 변하지 않는 5개 번호와, 이번 주만의 특별한 운때를 담은 1개 번호를 조합합니다.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '22px', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '12px' }}>📊</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#333' }}>주간 맞춤형 운세 리포트</div>
              <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                단순한 숫자를 넘어 <strong>재물, 애정, 건강 점수</strong>를 전국 상위 백분율로 산출하여 이번 주 당신의 흐름을 안내합니다.
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '25px', backgroundColor: '#f9fbe7', padding: '15px', 
          borderRadius: '12px', fontSize: '11px', color: '#558b2f', textAlign: 'center',
          lineHeight: '1.5', border: '1px solid #dcedc8'
        }}>
          "사주는 당신의 뿌리이고, 운세는 당신이 만날 바람입니다.<br/>
          입장로또는 그 둘이 만나는 최적의 지점을 계산합니다."
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
