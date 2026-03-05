import React, { useState } from 'react';
import { calculateSaju, SajuResult } from '../utils/saju';

const SajuCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '1990-01-01',
    time: '12:00',
    gender: 'male' as 'male' | 'female'
  });
  const [result, setResult] = useState<SajuResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const data = calculateSaju(formData.date, formData.time, formData.gender);
    setResult(data);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Saju (Four Pillars) Calculator</h1>
      <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Birth Date:
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
        </label>
        <label>
          Birth Time:
          <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <button type="submit">Calculate Saju</button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', border: '1px solid #ddd', padding: '15px' }}>
          <h2>Results</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div><strong>Year:</strong> {result.yearPillar}</div>
            <div><strong>Month:</strong> {result.monthPillar}</div>
            <div><strong>Day:</strong> {result.dayPillar}</div>
            <div><strong>Hour:</strong> {result.hourPillar}</div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Five Elements Distribution</h3>
            <ul>
              <li>Wood: {result.fiveElements.wood}</li>
              <li>Fire: {result.fiveElements.fire}</li>
              <li>Earth: {result.fiveElements.earth}</li>
              <li>Metal: {result.fiveElements.metal}</li>
              <li>Water: {result.fiveElements.water}</li>
            </ul>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Raw Data (for AI prompt)</h3>
            <pre style={{ background: '#f4f4f4', padding: '10px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SajuCalculator;
