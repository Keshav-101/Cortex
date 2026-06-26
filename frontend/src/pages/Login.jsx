import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧠 Cortex</h1>
        <p style={styles.sub}>Welcome back. Your knowledge awaits.</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input style={styles.input} placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button style={styles.btn} onClick={handleSubmit}>Log In</button>
        <p style={styles.link}>No account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#1a1a2e', padding: '40px', borderRadius: '16px', width: '360px', boxShadow: '0 0 40px rgba(99,102,241,0.2)' },
  title: { color: '#fff', fontSize: '28px', margin: '0 0 8px', textAlign: 'center' },
  sub: { color: '#888', textAlign: 'center', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' },
  error: { color: '#f87171', marginBottom: '12px', textAlign: 'center' },
  link: { color: '#888', textAlign: 'center', marginTop: '16px' }
};