import React, { useState ,useEffect} from 'react';
import axios from 'axios'


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
  }, []);


  const fetchStaffList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/');
      console.log(response.data);
      const formattedStaffList = response.data.users.map(staff => ({
        name: staff.fullname,
        email: staff.email,
        id: staff._id 
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
          console.log('Staff updated successfully:', response.data);
          fetchStaffList();
        }
      } else {
        const response = await axios.post('http://localhost:8080/users/register', {
          ...newStaff,
        });

        if (response.status === 201) {
          console.log('New staff added successfully:', response.data);
          setNewStaff({
            name: '',
            email: '',
          });
          fetchStaffList(); // Fetch updated staff list after addition
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
        const updatedList = staffList.filter((staff, i) => i !== deleteIndex);
        setStaffList(updatedList);
        setDeleteConfirmation(false);
        setDeleteIndex(-1);
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };
      

  const handleEditStaff = (index) => {
    // Set the editIndex to the index of the staff being edited
    setEditIndex(index);

    // Set the newStaff state to the staff details being edited
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
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr key={index}>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEditStaff(index)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteConfirmation(index)}>
                    Delete
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
