import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import API_URLS from '../apiEndpoints';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post(`${API_URLS.IDENTITY_SERVICE}/login`, {
        email,
        password,
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Login successful!');
        dispatch(
          loginSuccess({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            userId: response.data.userId,
          })
        );
        setEmail('');
        setPassword('');
        setTimeout(() => navigate('/get-all-posts'), 500);
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-root">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {success && <div className="login-success">{success}</div>}
        {error && <div className="login-error">{error}</div>}
        <div className="login-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="Enter email"
          />
        </div>
        <div className="login-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter password"
          />
        </div>
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button
          className="login-btn register-btn"
          type="button"
          onClick={handleRegisterRedirect}
          disabled={loading}
          style={{ marginTop: '10px', backgroundColor: '#eee', color: '#333' }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;