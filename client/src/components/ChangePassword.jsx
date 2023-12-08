import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const response = await axios.put(`http://localhost:8080/users/change-password/${currentUser.user._id}`, {
        newPassword: newPassword,
        passwordChange: currentUser.user.passwordChangeRequired,
      });

      if (response.status === 200) {
        setSuccess(true);

        
        setTimeout(() => {
          setSuccess(false);
          navigate('/login');
        }, 1000);
        
      }
    } catch (error) {
      console.error('Error changing password:', error.message);
      setError(error.message || 'Password change failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      <div className="change-password-dialog">
        <h1>Change Password</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
        >
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="input-box"
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-box"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

    
        {success && (
          <div className="success-dialog">
            <p style={{ color: 'green' }}>Password changed successfully!</p>
          </div>
        )}
        
      </div>
    </main>
  );
};

export default ChangePassword;
