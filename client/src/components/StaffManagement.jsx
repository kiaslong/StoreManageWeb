import React, { useState ,useEffect} from 'react';
import axios from 'axios'
import defaultavatar from '../assets/default_logo_user.png';


const StaffComponent = () => {
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
  
    fetchStaffList();

   
    const intervalId = setInterval(() => {
      fetchStaffList();
    }, 15000);

    return () => clearInterval(intervalId);
    
  }, []);



  const handleToggleLock = async (index) => {
    try {
      const staffToToggle = staffList[index];
      const response = await axios.put(`http://localhost:8080/users/toggle-lock/${staffToToggle.id}`);
  
      if (response.status === 200) {

        setErrorMessage(response.data.message);
        setShowErrorModal(true)

        setTimeout(() => {
          setShowErrorModal(false);
        }, 1200);

        fetchStaffList(); 

       
      }
    } catch (error) {
      console.error('Error toggling lock:', error);
    }
  };
  
  const handleResendEmail = async (index) => {
    try {
      const staffToResendEmail = staffList[index];
      const response = await axios.post(`http://localhost:8080/users/resend-email/${staffToResendEmail.id}`);
  
      if (response.status === 200) {
        setErrorMessage(response.data.message);
        setShowErrorModal(true)

        setTimeout(() => {
          setShowErrorModal(false);
        }, 1500);

      }
    } catch (error) {
      console.error('Error resending email:', error);
    }
  };
  



  const fetchStaffList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/');
      const formattedStaffList = response.data.users.map(staff => ({
        name: staff.fullname,
        email: staff.email,
        id: staff._id, 
        isLock: staff.isLock,
        passwordChangeRequired: staff.passwordChangeRequired,
        profilePhotoURL: staff.profilePhotoURL
      }));
      setStaffList(formattedStaffList);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      setStaffList([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value,
    });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    try {
      if (editIndex !== -1) {
        const response = await axios.put(`http://localhost:8080/users/${newStaff.id}`, newStaff);
        if (response.status === 200) {
          setErrorMessage(`Staff updated successfully`);
          setShowErrorModal(true)
          fetchStaffList();
          setNewStaff({
            name: '',
            email: '',
          });
          setEditIndex(-1);

          setTimeout(() => {
            setShowErrorModal(false);
          }, 1500);

        }
      } else {
        const response = await axios.post('http://localhost:8080/users/register', {
          ...newStaff,
        });

        if (response.status === 201) {
          setErrorMessage(`New staff added successfully`);
          setShowErrorModal(true)
          setNewStaff({
            name: '',
            email: '',
          });
          fetchStaffList(); 
          setTimeout(() => {
            setShowErrorModal(false);
          }, 1500);

          
        }
      }
    } catch (error) {
      setErrorMessage(`${error.response.data.message}`);
      setShowErrorModal(true);
    }
  };


  const handleDeleteConfirmation = (index) => {
    setDeleteConfirmation(true);
    setDeleteIndex(index);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(false);
    setDeleteIndex(-1);
  };

   
  const handleConfirmDelete = async () => {
    try {
      const staffToDelete = staffList[deleteIndex];
      const response = await axios.delete(`http://localhost:8080/users/${staffToDelete.id}`);

      if (response.status === 200) {
        setErrorMessage(`Staff deleted successfully`);
        setShowErrorModal(true)
        const updatedList = staffList.filter((staff, i) => i !== deleteIndex);
        setStaffList(updatedList);
        setDeleteConfirmation(false);
        setDeleteIndex(-1);


        setTimeout(() => {
          setShowErrorModal(false);
        }, 1500);
        

      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };
      

  const handleEditStaff = (index) => {
  
    setEditIndex(index);

   
    setNewStaff(staffList[index]);
  };

  return (
    <main>
    <div className="breadcrumb-list">
      <span>{'Home ->'}</span>
      <ul className="breadcrumb">
        <li>
          <a>Staff Management</a>
        </li>
      </ul>
    </div>
    <div className="staff-component">
      <h2>Add/Edit Staff</h2>
      <form onSubmit={handleAddStaff}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newStaff.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={newStaff.email}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">{editIndex !== -1 ? 'Update Staff' : 'Add Staff'}</button>
      </form>

      <div className="staff-list">
  <h2>Staff List</h2>
  <table>
    <thead>
      <tr>
        <th>User Avatar</th>
        <th>Name</th>
        <th>Email</th>
        <th>Active</th>
        <th>Locked</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {staffList.map((staff, index) => (
        <tr key={index}>
          <td>
            <img
              src={staff.profilePhotoURL !=='' && staff.profilePhotoURL !==null ? `http://localhost:8080/${staff.profilePhotoURL}` : defaultavatar}
              alt=""
            />
          </td>
          <td>{staff.name}</td>
          <td>{staff.email}</td>
          <td>
            {!staff.passwordChangeRequired ? (
              <span style={{ color: 'green' }}>Active</span>
            ) : (
              <span style={{ color: 'red' }}>Inactive</span>
            )}
          </td>
          <td>
            {staff.isLock ? (
              <span style={{ color: 'red' }}>Locked</span>
            ) : (
              <span style={{ color: 'green' }}>Not Locked</span>
            )}
          </td>
          <td>
            <button className="edit-button" onClick={() => handleEditStaff(index)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => handleDeleteConfirmation(index)}>
              Delete
            </button>
            <button className="toggle-lock-button" onClick={() => handleToggleLock(index)}>
              {staff.isLock ? 'Unlock' : 'Lock'}
            </button>
            <button className="resend-email-button" onClick={() => handleResendEmail(index)}>
              Resend
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



    </div>

    {showErrorModal && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close" onClick={() => setShowErrorModal(false)}>&times;</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

        {deleteConfirmation && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete-content">
            <p>Are you sure you want to delete this staff member?</p>
            <button onClick={handleCancelDelete}>Cancel</button>
            <button onClick={handleConfirmDelete}>Delete</button>
          </div>
        </div>
      )}

    </main>

    
  );
};

export default StaffComponent;
