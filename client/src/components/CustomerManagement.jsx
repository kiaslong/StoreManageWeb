import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../scss/Customer.scss';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
  const [purchaseHistoryCurrentPage, setPurchaseHistoryCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [purchaseSearchTerm, setPurchaseSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = async (customerId) => {
    try {
      const [purchasesResponse, customerDetailsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/customers/${customerId}/orderhistory`),
        axios.get(`http://localhost:8080/customers/${customerId}`),
      ]);

      setPurchaseHistory(purchasesResponse.data);
      setCustomerDetails(customerDetailsResponse.data);
      setSelectedCustomer(customerId);
      setSelectedPurchase(null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePurchaseClick = (purchaseId) => {
    setSelectedPurchase((prevSelectedPurchase) =>
      prevSelectedPurchase === purchaseId ? null : purchaseId
    );
  };

  const paginateCustomers = (pageNumber) => setCustomerCurrentPage(pageNumber);
  const paginatePurchaseHistory = (pageNumber) => setPurchaseHistoryCurrentPage(pageNumber);

  const indexOfLastCustomer = customerCurrentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;

  const indexOfLastPurchase = purchaseHistoryCurrentPage * itemsPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - itemsPerPage;

  const filteredCustomers = customers.filter((customer) =>
    `${customer.fullName} ${customer.phoneNum}`.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

 const filteredPurchases = purchaseHistory.filter((purchase) =>
  `${purchase._id}`.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
  `${purchase.totalAmount}`.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
  `${purchase.payMethod}`.toLowerCase().includes(purchaseSearchTerm.toLowerCase())||
  `${purchase.date}`.toString().toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
  `${purchase.totalQuantity}`.toLowerCase().includes(purchaseSearchTerm.toLowerCase())
);




  return (
    <main>
      <div className="breadcrumb-list">
        <span>{'Home ->'}</span>
        <ul className="breadcrumb">
          <li>
            <a>Customers Management</a>
          </li>
        </ul>
      </div>
      <div className="customer-management-container">
        <h2>Customer List</h2>
        <div className="search-bar">
          <label htmlFor="customerSearch">Customer Search:</label>
          <input
            type="text"
            id="customerSearch"
            value={customerSearchTerm}
            onChange={(e) => setCustomerSearchTerm(e.target.value)}
          />
        </div>
        <ul className="customer-list">
          {filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer).map((customer, index) => (
            <li key={customer._id} onClick={() => handleCustomerClick(customer._id)}>
              <div className="customer-info">
                <span className="customer-number">{index + 1 + indexOfFirstCustomer}. </span>
                <strong>{customer.fullName}</strong> -{' '}
                <span className="customer-phone">{customer.phoneNum}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredCustomers.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginateCustomers(index + 1)}
              className="pagination-button"
            >
              {index + 1}
            </button>
          ))}
        </div>
        {selectedCustomer && (
          <div>
            <h2>Customer Details</h2>
            <p>
              <strong>Full Name:</strong> {customerDetails.fullName}
            </p>
            <p>
              <strong>Phone Number:</strong> {customerDetails.phoneNum}
            </p>
            <p>
              <strong>Address:</strong> {customerDetails.address}
            </p>

            <h2>Purchase History for {customerDetails.fullName}</h2>
            <div className="search-bar">
              <label htmlFor="purchaseSearch">Purchase Search:</label>
              <input
                type="text"
                id="purchaseSearch"
                value={purchaseSearchTerm}
                onChange={(e) => setPurchaseSearchTerm(e.target.value)}
              />
            </div>
            <ul className="purchase-history-list">
              {selectedPurchase ? (
                <li key={selectedPurchase}>
                  <div className="purchase-info" onClick={() => handlePurchaseClick(selectedPurchase)}>
                    <strong>Order ID:</strong> {selectedPurchase} -{' '}
                    <strong>Total Amount:</strong> $
                    {purchaseHistory
        .filter((purchase) => purchase._id === selectedPurchase)
        .map((filteredPurchase) => filteredPurchase.totalAmount.toFixed(2))} -{' '}
        <strong>CashBack:</strong> $
                    {purchaseHistory
        .filter((purchase) => purchase._id === selectedPurchase)
        .map((filteredPurchase) => filteredPurchase.cashBack.toFixed(2))} -{' '}
           <strong>PayMethod: </strong>
      {purchaseHistory
        .filter((purchase) => purchase._id === selectedPurchase)
        .map((filteredPurchase) => filteredPurchase.payMethod.toString())}  -{' '}
                <strong>Purchase Date:</strong>{' '}
      {purchaseHistory
        .filter((purchase) => purchase._id === selectedPurchase)
        .map((filteredPurchase) => filteredPurchase.date.toString().split('T')[0])} -{' '}  
         <strong>Total Quantity: </strong>
        {purchaseHistory   
        .filter((purchase) => purchase._id === selectedPurchase)
        .map((filteredPurchase) => filteredPurchase.totalQuantity.toString())}  
    </div>
                  
                
   
                  <div className="product-list-container visible">
                    <ul className="product-list-cust">
                      {purchaseHistory
                        .find((purchase) => purchase._id === selectedPurchase)
                        ?.products.map((product) => (
                          <li key={product._id}>
                            <div className="product-info">
                              <img
                                src={`http://localhost:8080/${product.value.imageUrl}`}
                                alt={product.value.productName}
                                className="product-image"
                              />
                              <div className="product-details">
                                <p>
                                  <strong>{product.value.productName}</strong>
                                </p>
                                <p>Quantity: {product.quantity}</p>
                                <p>Price: ${product.value.retailPrice}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </li>
              ) : (
                filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase).map((purchase) => (
                  <li key={purchase._id}>
                    <div className="purchase-info" onClick={() => handlePurchaseClick(purchase._id)}>
                      <strong>Order ID:</strong> {purchase._id} -{' '}
                      <strong>Total Amount:</strong> ${purchase.totalAmount.toFixed(2)}
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div className="pagination">
              {Array.from({ length: Math.ceil(filteredPurchases.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginatePurchaseHistory(index + 1)}
                  className="pagination-button"
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};




export default CustomerManagement;
