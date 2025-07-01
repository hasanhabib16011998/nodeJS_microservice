import { useState } from 'react';
import axios from 'axios';
import './styles/Register.css';
import API_URLS from '../apiEndpoints';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post(`${API_URLS.IDENTITY_SERVICE}/register`, {
        username,
        email,
        password,
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Registration successful!');
        setUsername('');
        setEmail('');
        setPassword('');
        // Optionally: store tokens here (response.data.accessToken, response.data.refreshToken)
      } else {
        setError(response.data.message || 'Registration failed.');
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

  return (
    <div className="register-root">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>
        {success && <div className="register-success">{success}</div>}
        {error && <div className="register-error">{error}</div>}
        <div className="register-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Enter username"
          />
        </div>
        <div className="register-group">
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
        <div className="register-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Enter password"
          />
        </div>
        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;