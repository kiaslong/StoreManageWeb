import React from 'react'

const RightSection = ({selecedContext}) => {
  return (
    (selecedContext && selecedContext === 'Products' ? (
      <div class="right-section">
      <div class="nav">
        <div class="profile">
          <div class="info">
            <p>Hi, <b>Admin</b></p>
          </div>
          <div class="profile-photo">
            <img src="assets/user1.jpg" alt="" srcset=""/>
          </div>
        </div>
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
        <div className="info">
          <p>
            Hi, <b>Admin</b>
          </p>
        </div>
        <div className="profile-photo">
          <img src="assets/user1.jpg" alt="" />
        </div>
      </div>
    </div>
    <aside class="settings">
  <div class="sidebar">
    <a >
      Change Password
    </a>
    <a >
      Edit Profile
    </a>
  </div>
</aside>
  </div> )
  )
  )

}

export default RightSection