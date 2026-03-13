import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      navigate('/welcome');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your details to sign in.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="primary-btn">
              <LogIn size={18} />
              Sign In
            </button>
            <button type="button" className="secondary-btn" onClick={() => alert("Sign up functionality not implemented.")}>
              <UserPlus size={18} />
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
