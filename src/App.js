import React, { useState, useMemo } from 'react';
import './App.css';

function App() {
  const [dreamText, setDreamText] = useState('');
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shapes = ['circle', 'star', 'pentagon'];

  const getRandomShape = () => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    switch (shape) {
      case 'circle':
        return <circle cx="20" cy="20" r="20" />;
      case 'star':
        return (
          <path d="M20 0 L25 15 L40 15 L28 24 L33 38 L20 30 L7 38 L12 24 L0 15 L15 15 Z" />
        );
      case 'pentagon':
        return (
          <path d="M20,0 L40,15 L32,40 L8,40 L0,15 Z" />
        );
      default:
        return <circle cx="20" cy="20" r="20" />;
    }
  };

  const floatingShapes = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 20;

      return (
        <div
          key={i}
          className="floating-shape"
          style={{
            left: `${left}vw`,
            top: `${top}vh`,
            animationDelay: `${delay}s`,
          }}
        >
          <svg viewBox="0 0 40 40">{getRandomShape()}</svg>
        </div>
      );
    });
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://dreamalyser.onrender.com/analyze_dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dream: dreamText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze dream');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset handler
  const handleReset = () => {
    setDreamText('');
    setResult(null);
    setName('');
    setError('');
    setLoading(false);
  };

  return (
    <div className="App">
      <div>{floatingShapes}</div>

      {!result && (
        <div className="flashy-banner">
          <span className="blink-text">🌙 Enter your dream and get your personalized dream card!! 🌈</span>
        </div>
      )}

      <div className="flashy-banner">
        <span className="blink-text">🔥 Dream Battles Coming Soon!! 🚀</span>
      </div>

<div className="max-w-xl mx-auto p-6 bg-white bg-opacity-90 rounded-xl shadow-md fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[90%]">
  {!result && (
    <>
      <h1 className="text-xl font-semibold mb-4 text-center">Dreams are more than just dreams ...</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 text-base mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        placeholder="Enter your dream..."
        value={dreamText}
        onChange={(e) => setDreamText(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 text-base mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Dream'}
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </>
  )}

  {result && (
    <div className="result">
      <h2 className="text-lg font-bold mb-4 text-center">{result.name}'s Dream Score</h2>
      <ul className="flex justify-between flex-wrap mb-4 border rounded-md overflow-hidden">
        <li className="flex-1 text-center border-r border-black p-2"style={{fontSize:"small"}}><strong>Emotion:</strong> {result.kpi_scores.emotion}</li>
        <li className="flex-1 text-center border-r border-black p-2"style={{fontSize:"small"}}><strong>Symbolism:</strong> {result.kpi_scores.symbolism}</li>
        <li className="flex-1 text-center border-r border-black p-2"style={{fontSize:"small"}}><strong>Vividness:</strong> {result.kpi_scores.vividness}</li>
        <li className="flex-1 text-center border-r border-black p-2"style={{fontSize:"small"}}><strong>Coherence:</strong> {result.kpi_scores.coherence}</li>
        <li className="flex-1 text-center border-r border-black p-2"style={{fontSize:"small"}}><strong>Resolution:</strong> {result.kpi_scores.resolution}</li>
        <li className="flex-1 text-center p-2"style={{fontSize:"small"}}><strong>Final:</strong> {result.kpi_scores.final}</li>
      </ul>

      <div className="card flex flex-col items-center justify-center">
        <p className="text-sm font-semibold mb-2">Your Dream Card:</p>
        <img
          src={result.card}
          alt="Dream Card"
          className="rounded-xl h-52 object-contain"
        />
      </div>

      <button
        onClick={handleReset}
        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
      >
        🔁 Analyze Another Dream
      </button>
    </div>
  )}
</div>

    </div>
  );
}

export default App;
