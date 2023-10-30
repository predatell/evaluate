import { useEffect, useState } from 'react';
import { login } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Alert } from 'reactstrap';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await login(username, password);
    if (error) {
      setErrorMessage(error);
    } else {
      navigate('/');
      resetForm();
    }
  };
    
  return (
    <main className="container">
      <h1 className="text-uppercase text-center my-4" >Login</h1>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card p-3">
            <p className="text-center">
              <Link to="/register">Do you want to register?</Link>
            </p>
            {errorMessage ? (
              <Alert color="danger">{errorMessage}</Alert>
            ) : null}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-block">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
