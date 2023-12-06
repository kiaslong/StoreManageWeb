import React from 'react'


const DashBoard = () => {
  return (
    <>
     <main>
    <div className="breadcrumb-list">
      <span>{'Home ->'}</span>
      <ul className="breadcrumb">
        <li>
          <a>Dashboard</a>
        </li>
      </ul>
    </div>
    <div className="analyse">
      <div className="sales">
        <div className="status">
          <div className="info">
            <h3>Total Sales</h3>
            <span>------</span>
            <h2>$13,500</h2>
          </div>
          <div className="progresss">
            <svg>
              <circle cx="38" cy="38" r="36" />
            </svg>
            <div className="percentage">
              <p>+81%</p>
            </div>
          </div>
        </div>
      </div>
 
    </div>
    <div className="new-users">
      <h2>New Customers</h2>
      <div className="user-list">
    
      </div>
    </div>
    <div className="list-order-product">
      <h2>Recent Orders</h2>
      <table>
        <thead>
          <tr>
            <th>CusName</th>
            <th>PhoneNum</th>
            <th>Address</th>
            <th>Day</th>
            <th>Time</th>
            <th>PayStatus</th>
            <th>ProdName</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{/* Table body */}</tbody>
      </table>
     
    </div>
  </main>
  </>
  )
}

export default DashBoard