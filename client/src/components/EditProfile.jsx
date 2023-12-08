import React, { useState, useEffect,useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import defaultavatar from '../assets/default_logo_user.png';
import axios from 'axios';

const EditProfile = () => {
const { currentUser} = useContext(AuthContext);

const [profileImage, setProfileImage] = useState(
    currentUser.user.profilePhotoURL
      ? `http://localhost:8080/${currentUser.user.profilePhotoURL}`
      : defaultavatar
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);



  useEffect(() => {
   
    
    if (currentUser.user) {
      setName(currentUser.user.fullname || '');
      setEmail(currentUser.user.email || '');
    }
  }, [currentUser.user]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setProfileImage(URL.createObjectURL(selectedImage));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('profileImage', document.getElementById('fileInput').files[0]);

      const response = await axios.patch(`http://localhost:8080/users/update-profile/${currentUser.user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response from the server
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data.user);
        setShowSuccessDialog(true);

        // Close success dialog after 3 seconds
        setTimeout(() => {
          setShowSuccessDialog(false);
        }, 3000);
        window.location.reload();
        
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setShowErrorDialog(true);

      // Close error dialog after 3 seconds
      setTimeout(() => {
        setShowErrorDialog(false);
      }, 3000);
    }
  };

  return (
    <main>
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="profile-image-section">

        <img
          src={profileImage}
  className="profile-image"
/>

          <input type="file" id='fileInput' accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="input-section">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-section">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="button-section">
    <button type="submit" className="edit-profile-button">
      Save Changes
    </button>
  </div>
      </form>
    </div>

    {showSuccessDialog && (
        <div className="dialog success-dialog">
          Profile updated successfully!
        </div>
      )}

 
      {showErrorDialog && (
        <div className="dialog error-dialog">
          Error updating profile!
        </div>
      )}
    </main>
  );
};

export default EditProfile;
