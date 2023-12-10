import axios from 'axios';
import React,{useState,useEffect} from 'react'



const DashBoard = () => {

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  const [recentOrders, setRecentOrders] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/orders')
      .then(response => {
        const orders = response.data;
        const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentOrders(sortedOrders.slice(0, 6));
      })
      .catch(error => console.error('Error fetching orders:', error));

    axios.get('http://localhost:8080/customers')
      .then(response => {
        const customers = response.data;
        const shuffledCustomers = shuffleArray(customers).slice(0, 5); // Take the first 5 after shuffling
        setNewCustomers(shuffledCustomers);
      })
      .catch(error => console.error('Error fetching new customers:', error));
  }, []);

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
    {newCustomers.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {newCustomers.map(customer => (
            <tr key={customer._id}>
              <td>{customer.fullName}</td>
              <td>{customer.phoneNum}</td>
              <td>{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No new customers found.</p>
    )}
  </div>
</div>

    <div className="list-order-product">
      <h2>Recent Orders</h2>
      {recentOrders.length > 0 && (
      <table>
        <thead>
          <tr>
            <th>CusName</th>
            <th>PhoneNum</th>
            <th>Address</th>
            <th>Day</th>
            <th>Time</th>
            <th>PayStatus</th>
            <th>Product Names</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {recentOrders.map(order =>  (
            <tr key={order._id}>
              <td>{order.fullName}</td>
              <td>{order.phoneNum}</td>
              <td>{order.address}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{new Date(order.date).toLocaleTimeString()}</td>
              <td>{order.payMethod}</td>
              <td>
  {order.products.map(product => product.value.productName).join(', ').substring(0, 100) + '...'}
</td>
              <td>{order.totalQuantity}</td>
              <td>Paid</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  </main>
  </>
  )
}

export default DashBoard