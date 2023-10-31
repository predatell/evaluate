import { useEffect, useState } from 'react';
import { register } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Alert } from 'reactstrap';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');        
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setPassword2('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await register(username, password, password2);
    if (error) {
      setErrorMessage(JSON.stringify(error));          
    } else {
      navigate('/');
      resetForm();
    }
  };

  return (
    <main className="container">
      <h1 className="text-uppercase text-center my-4" >Register</h1>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card p-3">
            <p className="text-center">
              <Link to="/login">I already have account</Link>
            </p>          
            {errorMessage ? (
              <Alert color="danger">{errorMessage}</Alert>              
            ) : null}
            {password2 !== password ? (
              <Alert color="danger">Passwords don't match</Alert>
            ): ''}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  onChange={(e) => { setUsername(e.target.value); setErrorMessage(""); }}
                  placeholder="Username"
                  required
                  />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  name="password2"
                  className="form-control"
                  onChange={(e) => { setPassword2(e.target.value); setErrorMessage(""); } }
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-block">Register</button>
              </div>                      
            </form>
          </div>
        </div>
      </div>
    </main>          
  );
}

export default Register;
