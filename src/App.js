import React, { useEffect, useState } from 'react';

export default function DreamAnalyzer() {
  const [dream, setDream] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);

  const analyzeDream = async () => {
    if (!dream.trim()) {
      setError('Please enter a dream description.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://dreamalyser.onrender.com/analyze_dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream, name }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.kpi_scores) {
        setError('No analysis received from server.');
        return;
      }

      setLeaderboard(prev => [
        ...prev,
        {
          name: data.name,
          dream,
          scores: data.kpi_scores,
        },
      ]);

      setDream('');
      setError(null);
      setSelectedUserIndex(null);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const dummyData = [
      {
        name: 'Ben',
        dream: 'I was walking through a forest made of mirrors.',
        scores: {
          emotion: 7,
          symbolism: 9,
          vividness: 8,
          coherence: 6,
          resolution: 5,
          final: 35,
        }
      },
      {
        name: 'Maya',
        dream: 'I met a dragon that spoke in riddles under a waterfall.',
        scores: {
          emotion: 9,
          symbolism: 10,
          vividness: 9,
          coherence: 7,
          resolution: 6,
          final: 41,
        }
      },
      {
        name: 'Liam',
        dream: 'I was trapped in an infinite library where books whispered.',
        scores: {
          emotion: 6,
          symbolism: 8,
          vividness: 7,
          coherence: 7,
          resolution: 8,
          final: 36,
        }
      },
    ];
    setLeaderboard(dummyData);
  }, []);
  const toggleDetails = (index) => {
    setSelectedUserIndex(selectedUserIndex === index ? null : index);
  };

  // Generate slow-blinking stars
  const stars = Array.from({ length: 100 }, (_, i) => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    return (
      <div
        key={i}
        className="star"
        style={{
          '--i': i,
          '--t': `${top}`,
          '--l': `${left}`,
        }}
      />
    );
  });

  return (
    <div style={{ position: 'relative', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <div className="star-field">{stars}</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', color: 'white' }}>
        <h1>Dream Analyzer</h1>

        <label htmlFor="name">Name:</label><br />
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input-box"
          placeholder='Enter your name'
        />

        <label htmlFor="dream">Enter your dream description:</label><br />
        <textarea
          id="dream"
          rows={5}
          value={dream}
          onChange={e => setDream(e.target.value)}
          className="input-box"
          placeholder="I was flying over a city with burning buildings and then I met a talking cat..."
        />

        <button
          onClick={analyzeDream}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            marginTop: '1rem'
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Dream'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        {leaderboard.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Final Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <React.Fragment key={i}>
                    <tr
                      className={`leaderboard-row ${selectedUserIndex === i ? 'selected' : ''}`}
                      onClick={() => toggleDetails(i)}
                    >
                      <td>{entry.name}</td>
                      <td>{entry.scores.final}/50</td>
                    </tr>

                    {selectedUserIndex === i && (
                      <tr className="leaderboard-details">
                        <td colSpan={2}>
                          <div>
                            <p><strong>Dream:</strong> {entry.dream}</p>
                            <p><strong>Emotion:</strong> {entry.scores.emotion}/10</p>
                            <p><strong>Symbolism:</strong> {entry.scores.symbolism}/10</p>
                            <p><strong>Vividness:</strong> {entry.scores.vividness}/10</p>
                            <p><strong>Coherence:</strong> {entry.scores.coherence}/10</p>
                            <p><strong>Resolution:</strong> {entry.scores.resolution}/10</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        body {
          background-color: black;
        }

        .input-box {
          color: black;
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .input-box:hover,
        .input-box:focus {
          border-color: #00f0ff;
          box-shadow: 0 0 8px #00f0ff;
          outline: none;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .leaderboard-table th,
        .leaderboard-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #555;
          text-align: left;
        }

        .leaderboard-row {
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .leaderboard-row:hover {
          background-color: #222;
        }

        .leaderboard-row.selected {
          background-color: #333;
        }

        .leaderboard-details td {
          background-color: #111;
        }

        .star-field {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: white;
          opacity: 0.2;
          top: calc(var(--t) * 1%);
          left: calc(var(--l) * 1%);
          animation: blink 6s infinite ease-in-out;
          animation-delay: calc(var(--i) * 0.1s);
        }

        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
