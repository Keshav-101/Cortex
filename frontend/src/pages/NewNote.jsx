import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title || !text) return alert('Fill in both fields!');
    setLoading(true);
    try {
      const { data } = await API.post('/notes', { title, originalText: text });
      navigate(`/note/${data._id}`);
    } catch (err) {
      alert('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/')}>← Back</button>
        <h2 style={styles.heading}>Create New Note</h2>
        <p style={styles.sub}>Drop your raw notes — Cortex will distill them into summaries, flashcards, and a quiz.</p>

        <input
          style={styles.input}
          placeholder="Note title (e.g. Chapter 3 - Photosynthesis)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Paste your study notes here... (the longer the better!)"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={14}
        />

        <button style={{...styles.btn, opacity: loading ? 0.7 : 1}} onClick={handleCreate} disabled={loading}>
          {loading ? '🤖 AI is analyzing your notes...' : '✨ Generate with AI'}
        </button>

        {loading && (
          <p style={styles.loadingMsg}>This takes 10-15 seconds. Claude is reading your notes!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', color: '#fff', padding: '32px 16px' },
  container: { maxWidth: '700px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '15px', padding: 0, marginBottom: '20px' },
  heading: { fontSize: '26px', margin: '0 0 8px' },
  sub: { color: '#888', marginBottom: '24px' },
  input: { width: '100%', padding: '13px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '13px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6' },
  btn: { width: '100%', padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600', marginTop: '12px' },
  loadingMsg: { color: '#888', textAlign: 'center', marginTop: '12px', fontSize: '14px' }
};