import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get('/notes').then(({ data }) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>🧠 Cortex</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hey, {user.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.topBar}>
          <h2 style={styles.heading}>My Notes</h2>
          <button style={styles.newBtn} onClick={() => navigate('/new')}>+ New Note</button>
        </div>

        {loading && <p style={styles.empty}>Loading your notes...</p>}

        {!loading && notes.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={{fontSize:'48px'}}>📚</p>
            <p style={styles.emptyText}>No notes yet. Create your first one!</p>
            <button style={styles.newBtn} onClick={() => navigate('/new')}>Create Note</button>
          </div>
        )}

        <div style={styles.grid}>
          {notes.map(note => (
            <div key={note._id} style={styles.card} onClick={() => navigate(`/note/${note._id}`)}>
              <h3 style={styles.cardTitle}>{note.title}</h3>
              <p style={styles.cardSummary}>{note.summary?.slice(0, 100)}...</p>
              <p style={styles.cardDate}>{new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid #222', background: '#1a1a2e' },
  logo: { margin: 0, fontSize: '22px', color: '#fff' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userName: { color: '#aaa' },
  logoutBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '8px', cursor: 'pointer' },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { margin: 0, fontSize: '24px' },
  newBtn: { padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  card: { background: '#1a1a2e', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #2a2a40', transition: 'border-color 0.2s' },
  cardTitle: { margin: '0 0 8px', fontSize: '17px', color: '#fff' },
  cardSummary: { color: '#888', fontSize: '14px', margin: '0 0 12px', lineHeight: '1.5' },
  cardDate: { color: '#555', fontSize: '12px', margin: 0 },
  empty: { color: '#666', textAlign: 'center', marginTop: '60px' },
  emptyBox: { textAlign: 'center', marginTop: '80px' },
  emptyText: { color: '#666', marginBottom: '20px' }
};