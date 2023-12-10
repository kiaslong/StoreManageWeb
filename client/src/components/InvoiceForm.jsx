import React from 'react';
import '../scss/InvoiceForm.scss'; 
const InvoiceForm = ({ data , onClose}) => {
  return (
    <>
    <div className="breadcrumb-list">
    <span>{'Home ->'}</span>
    <ul className="breadcrumb">
      <li>
        <a>Checkout</a>
      </li>
    </ul>
  </div>
  
    <div className="invoice-form">
    <div className="close-button" onClick={onClose}>
        &times;
      </div>
      <h2>Invoice</h2>
      <p>Order Details: {data.fullName} - {data.phoneNum} </p>
      <p>Phone Number: {data.phoneNum}</p>
      <p>Full Name: {data.fullName}</p>
      <p>Address: {data.address}</p>

      <h3>Products:</h3>
      <ul className="product-list">
        {data.products.map((product, index) => (
          <li key={index} className="product-item">
            <img
              src={`http://localhost:8080/${product.value.imageUrl}`}
              alt={product.value.productName}
              className="product-image-invoice"
            />
            <div className="product-details">
              <p>Barcode - {product.value.barcode}</p>
              <p>ProductName: {product.value.productName}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ${product.value.retailPrice}</p>
            </div>
          </li>
        ))}
      </ul>

      <p>Total Amount: ${data.totalAmount}</p>
      <p>Creation Date: {data.date}</p>
    </div>
    </>
  );
};

export default InvoiceForm;
