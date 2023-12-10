import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Analytics = () => {
  const [selectedTimeline, setSelectedTimeline] = useState('today');
  const [data, setData] = useState({ orders: [], totalAmount: 0, totalOrders: 0, totalProducts: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userRole, setUserRole] = useState('sales'); // or 'admin'

  useEffect(() => {
    // Fetch data based on `selectedTimeline`
    const fetchData = async () => {
      // Replace with actual API call
      const response = await fetch(`/api/sales-data?timeline=${selectedTimeline}`);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [selectedTimeline]);

  const renderOrderList = () => {
    return data.orders.map(order => (
      <div key={order.id} className="order-item" onClick={() => setSelectedOrder(order)}>
        {order.summary}
      </div>
    ));
  };

  // Example data for a bar chart
  const barChartData = {
    labels: ['Total Amount', 'Number of Orders', 'Number of Products'],
    datasets: [
      {
        label: 'Sales Data',
        data: [data.totalAmount, data.totalOrders, data.totalProducts],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <main>
        <div className="breadcrumb-list">
        <span>{'Home ->'}</span>
        <ul className="breadcrumb">
          <li>
            <a >Analytics</a>
          </li>
        </ul>
      </div>
          <div className="analytics-container">
          <h1>Analytics</h1>
          <div className="chart-container">
            <Bar data={barChartData} />
          </div>
          <p>Total Amount: {data.totalAmount}</p>
          <p>Number of Orders: {data.totalOrders}</p>
          <p>Number of Products: {data.totalProducts}</p>
          {userRole === 'admin' && <p>Total Profit: {/* Display total profit here */}</p>}
          <div className="orders-container">
            <h2>Orders</h2>
            {renderOrderList()}
          </div>
          {selectedOrder && <div className="order-details">{/* Render selected order details here */}</div>}
        </div>

      </main>
    </>
   
  );
}

export default Analytics;
