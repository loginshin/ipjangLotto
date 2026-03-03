import { useState, useEffect } from 'react';
import { generateLottoNumbers } from './utils/lotto';
import './App.css';

interface HistoryItem {
  id: number;
  numbers: number[];
  date: string;
  seed: string;
}

function App() {
  const [name, setName] = useState('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lotto_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleGenerate = () => {
    if (!name.trim()) {
      alert('이름이나 생년월일을 입력해주세요!');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const seed = `${today}-${name}`;
    const result = generateLottoNumbers(seed);

    setIsAnimating(true);
    setNumbers(result);

    // Save to history
    const newItem: HistoryItem = {
      id: Date.now(),
      numbers: result,
      date: new Date().toLocaleString(),
      seed: name,
    };

    const newHistory = [newItem, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem('lotto_history', JSON.stringify(newHistory));

    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleShare = async () => {
    if (numbers.length === 0) return;

    const text = `[입장로또] 오늘의 행운 번호: ${numbers.join(', ')}\n당신의 행운을 확인해보세요!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '입장로또 행운 번호',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
      alert('번호가 클립보드에 복사되었습니다!');
    }
  };

  const getBallClass = (n: number) => {
    if (n <= 10) return 'ball-1';
    if (n <= 20) return 'ball-2';
    if (n <= 30) return 'ball-3';
    if (n <= 40) return 'ball-4';
    return 'ball-5';
  };

  return (
    <div className="container">
      <h1 className="title">🍀 입장로또</h1>
      <p className="description">오늘의 날짜와 당신의 정보로 생성된 세상에 하나뿐인 번호</p>

      <div className="input-group">
        <input
          type="text"
          placeholder="이름 또는 생년월일 (예: 홍길동880101)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleGenerate}>행운의 번호 뽑기</button>
      </div>

      {numbers.length > 0 && (
        <div className="result-area">
          <div className="ball-container">
            {numbers.map((num, idx) => (
              <div 
                key={`${num}-${idx}`} 
                className={`ball ${getBallClass(num)}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {num}
              </div>
            ))}
          </div>
          
          <div className="actions">
            <button className="share-btn" onClick={handleShare}>번호 공유하기</button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h3>📜 최근 나의 행운 번호</h3>
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <span>{item.numbers.join(', ')}</span>
              <small>{item.date.split(' ')[0]}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
