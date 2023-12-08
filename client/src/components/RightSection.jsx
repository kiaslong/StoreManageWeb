import React,{useContext} from 'react'
import { AuthContext } from '../context/AuthContext';
import defaultAvatar from '../assets/default_logo_user.png';

const RightSection = ({selecedContext,handleSelectedComponent}) => {
  const { currentUser } = useContext(AuthContext);
  return (
    (selecedContext && selecedContext === 'Products' ? (
      <div class="right-section">
      <div class="nav">
        <div class="profile">
            <p>Hi, <b>{currentUser?.user?.fullname || ''}</b></p>
          <div class="profile-photo">
            <img src={currentUser.user.profilePhotoURL !=='' ? `http://localhost:8080/${currentUser.user.profilePhotoURL}` : defaultAvatar} alt="" srcset=""/>
          </div>
        </div>
        <aside class="settings">
  <div class="sidebar">
    <a onClick={() => handleSelectedComponent('ChangePassword')} >
      Change Password
    </a>
    <a onClick={() => handleSelectedComponent('EditProfile')} >
      Edit Profile
    </a>
  </div>
</aside>
        <div class="add-product">
          <div class="header">
            <h2>Add New Product</h2>
          </div>
          <form action="/products/add" method="post">
            <div class="main-product-info">
              <div class="product-name">
                <label for="productName">Product Name:</label>
                <input type="text" id="productName" name="productName" placeholder="Enter product name"/>
              </div>
              <div class="product-price">
                <label for="importPrice">Import Price:</label>
                <input type="text" id="importPrice" name="importPrice" placeholder="Enter import price"/>
              </div>
              <div class="product-price">
                <label for="retailPrice">Retail Price:</label>
                <input type="text" id="retailPrice" name="retailPrice" placeholder="Enter retail price"/>
              </div>
              <div class="product-category">
                <label for="category">Product Category:</label>
                <input type="text" id="category" name="category" placeholder="Enter product category"/>
              </div>
              <button type="submit">Add Product</button>
            </div>
          </form>
        </div>
      </div>
      
    </div>  
    ) : (  <div className="right-section">
    <div className="nav">
      <div className="profile">
          <p>
            Hi, <b>{currentUser?.user?.fullname || ''}</b>
          </p>
        <div className="profile-photo">
        <img src={currentUser.user.profilePhotoURL !=='' ? `http://localhost:8080/${currentUser.user.profilePhotoURL}` : defaultAvatar} alt="" srcset=""/>
        </div>
      </div>
    </div>
    <aside class="settings">
  <div class="sidebar">
    <a onClick={() => handleSelectedComponent('ChangePassword')} >
      Change Password
    </a>
    <a onClick={() => handleSelectedComponent('EditProfile')} >
      Edit Profile
    </a>
  </div>
</aside>
  </div> )
  )
  )

}

export default RightSection