import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Analytics = () => {
  const [selectedTimeline, setSelectedTimeline] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [data, setData] = useState({ orders: [], totalAmount: 0, totalOrders: 0, totalProducts: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [userRole, setUserRole] = useState('sales'); // or 'admin'

  useEffect(() => {
    const fetchData = async () => {
      try {
        let timelineParams = { timeline: selectedTimeline };
        
        
        if (selectedTimeline === 'custom') {
          timelineParams = {
            timeline: selectedTimeline,
            start: customStartDate,
            end: customEndDate,
          };
        }

        const response = await axios.get(`http://localhost:8080/orders/analytics`, {
          params: timelineParams,
        });

        const result = response.data;

        setData(result);
        console.log(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, [selectedTimeline, customStartDate, customEndDate]);

  const renderOrderList = () => {
    const ordersPerPage = 3; // Adjust the number of orders per page as needed
    const startIndex = currentPage * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;

    return (
      <>
        {data.orders.slice(startIndex, endIndex).map((order, index) => (
          <div key={order._id} className="order-item" onClick={() => toggleOrderDetails(startIndex + index)}>
            Customer: {order.fullName} - Phone Number: {order.phoneNum} - Total Amount: {order.totalAmount} - Total Quantity: {order.totalQuantity}
            {selectedOrderIndex === startIndex + index && (
              <div className="order-details">
                <h3>Order Details</h3>
                <p>Order ID: {order._id}</p>
                <h4>Products:</h4>
                <ul>
                  {order.products.map(product => (
                    <li key={product.barcode}>
                      Barcode: {product.value.barcode} - Product Name: {product.value.productName} - Quantity: {product.quantity} - Price: {product.value.retailPrice}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {data.orders.length > ordersPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(data.orders.length / ordersPerPage) }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  const toggleOrderDetails = (index) => {
    setSelectedOrderIndex(selectedOrderIndex === index ? null : index);
  };

  const barChartData = {
    labels: ['Total Amount'],
    datasets: [
      {
        label: 'Total Amount',
        data: [data.totalAmount],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  const barChartDataOrdersAndProducts = {
    labels: ['Number of Orders and Products'],
    datasets: [
      {
        label: 'Number of Orders',
        data: [data.totalOrders],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Number of Products',
        data: [data.totalProducts],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
  };

  return (
    <>
      <main>
        <div className="breadcrumb-list">
          <span>{'Home ->'}</span>
          <ul className="breadcrumb">
            <li>
              <a>Analytics</a>
            </li>
          </ul>
        </div>
        <div className="analytics-container">
          <h1>Analytics</h1>
          <div className="timeline-selector">
            <label>Select Timeline: </label>
            <select onChange={(e) => handleTimelineChange(e.target.value)} value={selectedTimeline}>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="thismonth">This Month</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {selectedTimeline === 'custom' && (
            <div className="custom-timeline">
              <label>From: </label>
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
              <label>To: </label>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
            </div>
          )}
          <div className="chart-container">
            <div className="chart">
              <Bar data={barChartData} />
            </div>
            <div className="chart">
              <Bar data={barChartDataOrdersAndProducts} />
            </div>
          </div>
          <p>Total Profit: {data.totalAmount}</p>
          <p>Number of Orders: {data.totalOrders}</p>
          <p>Number of Products: {data.totalProducts}</p>
          <div className="orders-container">
            <h2>Orders</h2>
            {renderOrderList()}
          </div>
        </div>
      </main>
    </>
  );
};

export default Analytics;
