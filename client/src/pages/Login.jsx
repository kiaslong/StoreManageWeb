import React, { useState } from 'react';
import axios from 'axios';
import '../scss/Login.scss';

const Login = () => {
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
 

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    const token = e.target.token.value;

    try {
      const response = await axios.post('http://localhost:8080/users/verify', { token });
      if (response.status === 200) {
        setIsTokenVerified(true);
        e.target.reset(); 
      }
    } catch (error) {
      console.error('Token verification failed:', error.response.message);
      setErrorMessage('Token verification failed please contact administrator if you do not have a valid token');
      setShowErrorModal(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('http://localhost:8080/users/login', { username, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setErrorMessage('Login successfully');
        setShowErrorModal(true);

        
        
        setTimeout(() => {
          setShowErrorModal(false); 
          window.location.reload();
          window.location.href = "/";
        }, 1000); 
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed');
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="login-container">
        <h1>MVL STORE</h1>
      <div className="wrapper">
        {isTokenVerified ? (
         
            <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="form-group">
              <div className="input-box">
                <input id="username" name="username" type="text" placeholder="Username" required />
                <i className="bx bxs-user" />
              </div>
              <div className="input-box">
                <input id="password" name="password" type="password" placeholder="Password" required />
                <i className="bx bxs-lock-alt" />
              </div>
            </div>
            <button className="btn" type="submit">Login</button>
          </form>
          
        ) : (
            <form onSubmit={handleTokenSubmit}>
            <h1>Enter Token</h1>
            <div className="form-group">
              <div className="input-box">
                <input id="token" name="token" type="text" placeholder="Enter Token" required />
                <i className="bx bxs-key" />
              </div>
            </div>
            <button className="btn" type="submit">Submit Token</button>
          </form>
        )}
      </div>

      {showErrorModal && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
