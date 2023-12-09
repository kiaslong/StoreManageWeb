import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const Checkout = () => {
  const [checkoutData, setCheckoutData] = useState({
    phoneNum: '',
    fullName: '',
    address: '',
    payStatus: '',
  });

  const [options, setOptions] = useState({
    search: [],
    phoneNum: [],
    payStatus: [
      { value: 'Paid', label: 'Cash' },
      { value: 'Pending', label: 'Card' },
    ],
  });

  const [customerDatabase, setCustomerDatabase] = useState([
    { phoneNum: '1234567890', fullName: 'John Doe', address: '123 Main St' },
    { phoneNum: '9876543210', fullName: 'Jane Smith', address: '456 Oak St' },
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        const fetchedProducts = response.data;

        const searchOptions = fetchedProducts.map((product) => ({
          value: product,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={`http://localhost:8080/${product.imageUrl}`}
              style={{ marginRight: '8px', width: '30px', height: '30px' }}
            />
            <span>{`Product name: ${product.productName} - Price: ${product.retailPrice}`}</span>
          </div>
          ),
        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          search: searchOptions,
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const phoneNumOptions = customerDatabase.map((customer) => ({
      value: customer.phoneNum,
      label: `${customer.fullName} - ${customer.address}`,
    }));

    setOptions((prevOptions) => ({
      ...prevOptions,
      phoneNum: phoneNumOptions,
    }));
  }, [customerDatabase]);

  const handleProductInputChange = (selectedOption) => {
   
    setCheckoutData((prevData) => ({
      ...prevData,
      product: selectedOption ,
    }));
  };
  
  const handleCustomerInputChange = (selectedOption) => {
    const selectedCustomer = customerDatabase.find(
      (customer) => customer.phoneNum === selectedOption.value
    );

    if (selectedCustomer) {
      setCheckoutData((prevData) => ({
        ...prevData,
        phoneNum: selectedOption.value,
        fullName: selectedCustomer.fullName,
        address: selectedCustomer.address,
      }));
    }
  };

  const handleAddProduct = () => {
    if (checkoutData.product) {
      const existingProductIndex = selectedProducts.findIndex(
        (product) => product.value === checkoutData.product.value
      );
  
      if (existingProductIndex !== -1) {
        const maxQuantity = checkoutData.product.value.quantity;
        let quantity = prompt(`Product already selected. Enter new quantity (max: ${maxQuantity}):`);
  
        if (quantity === null) {
          // User canceled the prompt
          return;
        }
  
        if (!isNaN(quantity) && quantity > 0 && quantity <= maxQuantity) {
          quantity = parseInt(quantity, 10);
  
          const updatedProducts = [...selectedProducts];
          updatedProducts[existingProductIndex] = {
            ...checkoutData.product,
            quantity: quantity,
          };
  
          setSelectedProducts(updatedProducts);
          setCheckoutData((prevData) => ({
            ...prevData,
            product: null,
          }));
        } else {
          alert(`Invalid quantity. Please enter a valid number between 1 and ${maxQuantity}.`);
        }
  
        return;
      }
  
      const maxQuantity = checkoutData.product.value.quantity;
      let quantity = prompt(`Enter quantity (max: ${maxQuantity}):`);
  
      if (quantity === null) {
        // User canceled the prompt
        return;
      }
  
      if (!isNaN(quantity) && quantity > 0 && quantity <= maxQuantity) {
        quantity = parseInt(quantity, 10);
  
        const selectedProductWithQuantity = {
          ...checkoutData.product,
          quantity: quantity,
        };
  
        setSelectedProducts((prevProducts) => [...prevProducts, selectedProductWithQuantity]);
        setCheckoutData((prevData) => ({
          ...prevData,
          product: null,
        }));
      } else {
        alert(`Invalid quantity. Please enter a valid number between 1 and ${maxQuantity}.`);
      }
    }
  };
  
  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulated logic to create a new customer account if it's the first time

    // Add logic to handle form submission, e.g., send data to the server
    console.log('Form submitted:', checkoutData);
  };

  const calculateTotalAmount = () => {
  
    return selectedProducts.reduce(
      
      (total, product) => total + product.quantity *  parseInt(product.value.retailPrice, 10),
      0
    );
  };

  return (
    <main>
        <div className="breadcrumb-list">
      <span>{'Home ->'}</span>
      <ul className="breadcrumb">
        <li>
          <a>Checkout</a>
        </li>
      </ul>
    </div>
      <div className="search-sections">
    <div className="search-section">
      <h2>Product Search</h2>
      <div className="search-inputs">
        <div className="form-group">
          <label htmlFor="search">Barcode or Product Name:</label>
          <Select
  id="search"
  name="search"
  options={options.search}
  value={checkoutData.product}
  onChange={handleProductInputChange}
  onInputChange={(inputValue) => setInputValue(inputValue)} // Update inputValue state as you type
  filterOption={(option, inputValue) =>
    option.value.barcode.includes(inputValue) ||
    option.value.productName.toLowerCase().includes(inputValue.toLowerCase())
  }
/>

        </div>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </div>

    {/* Customer Search Section */}
    <div className="search-section">
      <h2>Customer Search</h2>
      <div className="search-inputs">
        <div className="form-group">
          <label htmlFor="phoneNum">Phone Number:</label>
          <Select
            id="phoneNum"
            name="phoneNum"
            options={options.phoneNum}
            value={options.phoneNum.find((opt) => opt.value === checkoutData.phoneNum)}
            onChange={handleCustomerInputChange}
          />
        </div>
      </div>
    </div>
  </div>

      <div className="checkout-form">
        <h2>Checkout Form</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNum">Phone Number:</label>
            <input
              type="text"
              id="phoneNum"
              name="phoneNum"
              value={checkoutData.phoneNum}
              onChange={(e) =>
                setCheckoutData((prevData) => ({
                  ...prevData,
                  phoneNum: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={checkoutData.fullName}
              onChange={(e) =>
                setCheckoutData((prevData) => ({
                  ...prevData,
                  fullName: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={checkoutData.address}
              onChange={(e) =>
                setCheckoutData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="payStatus">Payment Method:</label>
            <Select
              id="payStatus"
              name="payStatus"
              options={options.payStatus}
              value={options.payStatus.find((opt) => opt.value === checkoutData.payStatus)}
              onChange={(selectedOption) =>
                setCheckoutData((prevData) => ({
                  ...prevData,
                  payStatus: selectedOption ? selectedOption.value : '',
                }))
              }
              required
            />
          </div>

          <div className="selected-products">
            <h2>Selected Products</h2>
            <ul>
              {selectedProducts.map((product) => (
                <li key={product.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ flex: '1' }}>
                    {product.label}
                  </span>
                  <span>
                    Quantity: {product.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <p>Total Amount: ${calculateTotalAmount().toFixed(1)}</p>
           
          </div>

          <button type="submit">Submit Order</button>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
