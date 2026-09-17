import React, { useState } from 'react';
import type { AgentResponse, AgentQuery } from '@migration-agent/shared';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function App() {
  const [query, setQuery] = useState('');
  const [subclass, setSubclass] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload: AgentQuery = { query };
      if (subclass) payload.visaSubclass = subclass;

      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: AgentResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          🇦🇺 Migration Intelligence Agent
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          AI-powered Australian migration policy guidance. Not legal advice — always consult a registered migration agent.
        </p>
      </header>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Your question
          </label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. What are the pros and cons of the 482 visa? What changed in July 2026?"
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Visa subclass (optional)
          </label>
          <select
            value={subclass}
            onChange={e => setSubclass(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '1rem',
            }}
          >
            <option value="">All / Auto-detect</option>
            <option value="189">189 — Skilled Independent</option>
            <option value="190">190 — Skilled Nominated</option>
            <option value="482">482 — Temp Skill Shortage</option>
            <option value="500">500 — Student</option>
            <option value="820">820 — Partner (Onshore)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Analysing...' : 'Ask Migration Agent'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '1rem',
          background: '#fde8f0',
          border: `1px solid var(--color-error)`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-error)',
          marginBottom: '1rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {response && (
        <div style={{
          background: 'var(--color-surface)',
          border: `1px solid var(--color-border)`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          {response.requiresHumanReview && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #f0ad4e',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              fontWeight: 500,
            }}>
              ⚠️ This case has been flagged for review by a registered migration agent.
            </div>
          )}

          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {response.answer}
          </div>

          {response.citations.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: `1px solid var(--color-border)`, paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Sources</h3>
              <ul style={{ listStyle: 'none', fontSize: '0.875rem' }}>
                {response.citations.map((c, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                      {c.text}
                    </a>
                    {' '}— {c.sourceAuthority}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Agents invoked: {response.subagentsInvoked.join(', ')} · Confidence: {(response.confidenceScore * 100).toFixed(0)}%
          </div>
        </div>
      )}

      <footer style={{ marginTop: '3rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderTop: `1px solid var(--color-border)`, paddingTop: '1rem' }}>
        Not legal or migration advice. Always consult a <a href="https://www.mara.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>MARA-registered migration agent</a> for complex cases.
      </footer>
    </div>
  );
}
