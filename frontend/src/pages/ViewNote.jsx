import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';

export default function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [tab, setTab] = useState('summary');   // summary | flashcards | quiz | chat
  const [chatMsg, setChatMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  useEffect(() => {
    API.get(`/notes/${id}`).then(({ data }) => setNote(data));
  }, [id]);

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    const msg = chatMsg;
    setChatMsg('');
    setChatLoading(true);
    const { data } = await API.post(`/notes/${id}/chat`, { message: msg });
    setNote(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, { role: 'user', content: msg }, { role: 'assistant', content: data.reply }]
    }));
    setChatLoading(false);
  };

  const deleteNote = async () => {
    if (!confirm('Delete this note?')) return;
    await API.delete(`/notes/${id}`);
    navigate('/');
  };

  if (!note) return <div style={{color:'#fff', textAlign:'center', marginTop:'100px'}}>Loading...</div>;

  const quizScore = note.quiz?.filter((q, i) => quizAnswers[i] === q.correct).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <button style={styles.back} onClick={() => navigate('/')}>← Dashboard</button>
          <button style={styles.deleteBtn} onClick={deleteNote}>🗑 Delete</button>
        </div>

        <h1 style={styles.title}>{note.title}</h1>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['summary', 'flashcards', 'quiz', 'chat'].map(t => (
            <button key={t} style={{...styles.tab, ...(tab === t ? styles.activeTab : {})}} onClick={() => setTab(t)}>
              {t === 'summary' && '📋 Summary'}
              {t === 'flashcards' && '🃏 Flashcards'}
              {t === 'quiz' && '❓ Quiz'}
              {t === 'chat' && '💬 Chat'}
            </button>
          ))}
        </div>

        {/* SUMMARY TAB */}
        {tab === 'summary' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>AI Summary</h3>
            <p style={styles.summaryText}>{note.summary}</p>
            <hr style={styles.divider} />
            <h3 style={styles.sectionTitle}>Your Original Notes</h3>
            <p style={styles.originalText}>{note.originalText}</p>
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {tab === 'flashcards' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Flashcards — tap to flip!</h3>
            <div style={styles.flashcardGrid}>
              {note.flashcards?.map((card, i) => (
                <div key={i} style={styles.flashcard} onClick={() => setFlippedCard(flippedCard === i ? null : i)}>
                  {flippedCard === i
                    ? <><p style={styles.cardLabel}>Answer</p><p style={styles.cardAnswer}>{card.answer}</p></>
                    : <><p style={styles.cardLabel}>Question</p><p style={styles.cardQuestion}>{card.question}</p></>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {tab === 'quiz' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Quiz Time!</h3>
            {note.quiz?.map((q, i) => (
              <div key={i} style={styles.quizQuestion}>
                <p style={styles.questionText}>{i + 1}. {q.question}</p>
                {q.options.map((opt, j) => {
                  let bg = '#1a1a2e';
                  if (quizSubmitted) {
                    if (opt === q.correct) bg = '#166534';
                    else if (opt === quizAnswers[i] && opt !== q.correct) bg = '#7f1d1d';
                  } else if (quizAnswers[i] === opt) bg = '#312e81';
                  return (
                    <div key={j} style={{...styles.option, background: bg}}
                      onClick={() => !quizSubmitted && setQuizAnswers({...quizAnswers, [i]: opt})}>
                      {opt}
                    </div>
                  );
                })}
              </div>
            ))}
            {!quizSubmitted
              ? <button style={styles.btn} onClick={() => setQuizSubmitted(true)}>Submit Quiz</button>
              : <div style={styles.scoreBox}>
                  <p style={styles.score}>🎯 Score: {quizScore} / {note.quiz?.length}</p>
                  <button style={styles.btn} onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}>Try Again</button>
                </div>
            }
          </div>
        )}

        {/* CHAT TAB */}
        {tab === 'chat' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Query your knowledge</h3>
            <div style={styles.chatBox}>
              {note.chatHistory.length === 0 && (
                <p style={styles.chatEmpty}>Ask anything about this knowledge. e.g. "Explain this simply" or "Give me 3 more quiz questions"</p>
              )}
              {note.chatHistory.map((msg, i) => (
                <div key={i} style={{...styles.bubble, ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble)}}>
                  {msg.content}
                </div>
              ))}
              {chatLoading && <div style={styles.aiBubble}>🤖 Thinking...</div>}
            </div>
            <div style={styles.chatInputRow}>
              <input style={styles.chatInput} placeholder="Ask something about your notes..."
                value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()} />
              <button style={styles.sendBtn} onClick={sendChat}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', color: '#fff', padding: '24px 16px' },
  container: { maxWidth: '800px', margin: '0 auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  back: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '15px', padding: 0 },
  deleteBtn: { background: 'none', border: '1px solid #7f1d1d', color: '#f87171', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' },
  title: { fontSize: '28px', margin: '0 0 20px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: { padding: '10px 18px', background: '#1a1a2e', border: '1px solid #333', color: '#aaa', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  activeTab: { background: '#6366f1', color: '#fff', border: '1px solid #6366f1' },
  section: { background: '#1a1a2e', padding: '24px', borderRadius: '12px' },
  sectionTitle: { margin: '0 0 16px', color: '#c7d2fe', fontSize: '17px' },
  summaryText: { lineHeight: '1.8', color: '#ddd' },
  divider: { border: 'none', borderTop: '1px solid #2a2a40', margin: '20px 0' },
  originalText: { lineHeight: '1.8', color: '#888', whiteSpace: 'pre-wrap' },
  flashcardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  flashcard: { background: '#0f0f1a', border: '1px solid #312e81', borderRadius: '12px', padding: '20px', minHeight: '130px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  cardLabel: { color: '#6366f1', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' },
  cardQuestion: { color: '#fff', margin: 0, lineHeight: '1.5' },
  cardAnswer: { color: '#86efac', margin: 0, lineHeight: '1.5' },
  quizQuestion: { marginBottom: '24px' },
  questionText: { fontWeight: '600', marginBottom: '12px', lineHeight: '1.5' },
  option: { padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', border: '1px solid #333', transition: 'background 0.2s' },
  btn: { padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '8px' },
  scoreBox: { textAlign: 'center', marginTop: '16px' },
  score: { fontSize: '22px', marginBottom: '16px' },
  chatBox: { minHeight: '300px', maxHeight: '400px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  chatEmpty: { color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '60px' },
  bubble: { padding: '12px 16px', borderRadius: '12px', maxWidth: '80%', lineHeight: '1.6', fontSize: '14px' },
  userBubble: { background: '#312e81', alignSelf: 'flex-end' },
  aiBubble: { background: '#1e293b', alignSelf: 'flex-start', color: '#ddd' },
  chatInputRow: { display: 'flex', gap: '8px' },
  chatInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '14px' },
  sendBtn: { padding: '12px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }
};