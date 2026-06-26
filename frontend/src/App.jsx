import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewNote from './pages/NewNote';
import ViewNote from './pages/ViewNote';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/new" element={<PrivateRoute><NewNote /></PrivateRoute>} />
        <Route path="/note/:id" element={<PrivateRoute><ViewNote /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
