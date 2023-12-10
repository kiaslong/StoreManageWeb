import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import InvoiceForm from './InvoiceForm';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal">
      <p>{message}</p>
      <div className="modal-buttons-center">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  </div>
);




const Checkout = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [productToRemoveIndex, setProductToRemoveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantityInput, setQuantityInput] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isExistingProduct, setIsExistingProduct] = useState(false);
  const [existingProductIndex, setExistingProductIndex] = useState(null);
  const [cashInput, setCashInput] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [customerDatabase, setCustomerDatabase] = useState([]);

  const [checkoutData, setCheckoutData] = useState({
    phoneNum: '',
    fullName: '',
    address: '',
    payMethod: '',
  });

const openModal = () => {
  setIsModalOpen(true);
};

const handleInvoiceClose = () => {
  setIsInvoiceVisible(false);

};
const closeModal = () => {
  setIsModalOpen(false);
  setIsExistingProduct(false); 
  setExistingProductIndex(null);
};


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

  const [options, setOptions] = useState({
    search: [],
    phoneNum: [],
    payMethod: [
      { value: 'Cash', label: 'Cash' },
      { value: 'Card', label: 'Card' },
    ],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/customers');
        const customers = response.data;
        setCustomerDatabase(customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [])


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const phoneNumOptions = customerDatabase.map((customer) => ({
      value: customer.phoneNum,
      label: `${customer.phoneNum} - ${customer.fullName} - ${customer.address}`,
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


  const handleQuantityChange = (index, action) => {
    const updatedProducts = [...selectedProducts];
    const currentQuantity = updatedProducts[index].quantity;

    if (action === 'increment') {
      updatedProducts[index].quantity = currentQuantity + 1;
    } else if (action === 'decrement' && currentQuantity > 0) {
      if (currentQuantity === 1) {
        // Open the confirmation dialog
        setIsConfirmationOpen(true);
        // Store the index of the product to be removed
        setProductToRemoveIndex(index);
      } else {
        updatedProducts[index].quantity = currentQuantity - 1;
      }
    }

    setSelectedProducts(updatedProducts);
  };

  const handleConfirmation = (confirmed) => {
    setIsConfirmationOpen(false);

    if (confirmed) {
      // Remove the product if confirmed
      const updatedProducts = [...selectedProducts];
      updatedProducts.splice(productToRemoveIndex, 1);
      setSelectedProducts(updatedProducts);
    }
  };
  
  const handleAddProduct = () => {
    if (checkoutData.product) {
      const existingProductIndex = selectedProducts.findIndex(
        (product) => product.value === checkoutData.product.value
      );
  
      // Check if the quantity is greater than 0
      if (checkoutData.product.value.quantity > 0) {
        if (existingProductIndex !== -1) {
          setIsExistingProduct(true);
          setExistingProductIndex(existingProductIndex);
  
          // Set initial quantity to show in the modal
          setQuantityInput(selectedProducts[existingProductIndex].quantity.toString());
  
          openModal();
        } else {
          setIsExistingProduct(false);
  
          setQuantityInput('');
          openModal();
        }
      } else {
        // Show a notification that the quantity is 0 or less
        alert('Out of Stock');
      }
    }
  };
  

  const handleQuantityInput = () => {
    const maxQuantity = checkoutData.product.value.quantity;
    const quantityValue = parseInt(quantityInput, 10);
    const existingProductIndex = selectedProducts.findIndex(
      (product) => product.value === checkoutData.product.value
    );
  
    
    if (!isNaN(quantityValue) && quantityValue >= 0 && quantityValue <= maxQuantity) {
      if (existingProductIndex !== -1) {
        // Product already exists, update the quantity
        const updatedProducts = [...selectedProducts];
        updatedProducts[existingProductIndex].quantity = quantityValue;
        setSelectedProducts(updatedProducts);
      } else {
        // Product does not exist, add a new one
        const selectedProductWithQuantity = {
          ...checkoutData.product,
          quantity: quantityValue,
        };
        setSelectedProducts((prevProducts) => [...prevProducts, selectedProductWithQuantity]);
      }
    } else {
      alert(`Invalid quantity. Please enter a valid number between 1 and ${maxQuantity}.`);
    }
  
    setCheckoutData((prevData) => ({
      ...prevData,
      product: null,
    }));
    closeModal(); // Close the modal after successfully updating or adding the product
  };
  

  const calculateTotalAmount = () => {
  
    return selectedProducts.reduce(
      
      (total, product) => total + product.quantity *  parseInt(product.value.retailPrice, 10),
      0
    );
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedProducts.length === 0) {
      alert('Please add products before submitting the order.');
      return;
    }
  
    let cashBack = 0;
    if (checkoutData.payMethod === 'Cash') {
      const cashAmount = parseFloat(cashInput);
  
      if (cashAmount < calculateTotalAmount()) {
        alert('Insufficient cash amount. Please enter a valid amount.');
        return;
      }
  
      cashBack = cashAmount - calculateTotalAmount();
    }
  
    const randomYear = 2023 + Math.floor(Math.random() * 2);
    const randomMonth = 11 + Math.floor(Math.random() * (12 - 11 + 1));
    const randomDay = Math.floor(Math.random() * 28) + 1;
  
    const orderData = {
      phoneNum: checkoutData.phoneNum,
      fullName: checkoutData.fullName,
      address: checkoutData.address,
      payMethod: checkoutData.payMethod,
      products: selectedProducts.map((product) => ({
        label: product.label.toString(),
        quantity: product.quantity,
        value: product.value,
      })),
      
      totalAmount: calculateTotalAmount(),
      cashBack: cashBack.toFixed(1),
      cashAmount: checkoutData.payMethod === 'Cash' ? parseFloat(cashInput).toFixed(1) : null,
      date: `${randomYear}-${randomMonth.toString().padStart(2, '0')}-${randomDay
        .toString()
        .padStart(2, '0')}`,
       totalQuantity: selectedProducts.reduce((total, product) => total + product.quantity, 0),  
    };
    try {
      const response = await axios.post('http://localhost:8080/orders', orderData);

      if (response.status === 201) {
        
        setInvoiceData(orderData);
        setIsSuccessDialogOpen(true);
        

        setTimeout(() => {
          setIsSuccessDialogOpen(false);
        }, 2000);
      
        setTimeout(() => {
          setIsInvoiceVisible(true);
        }, 3000);
        
        // Clear the form fields
        setCheckoutData({
          phoneNum: '',
          fullName: '',
          address: '',
          payMethod: '',
        });
        
        setSelectedProducts([]);
        setCashInput('');
        setQuantityInput('');
        await fetchProducts();
      } else {
        console.error('Error creating order. Unexpected status code:', response.status);

        // Show the error dialog
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('Error creating order:', error);

      // Show the error dialog
      setIsErrorDialogOpen(true);
    }

  };
  
  
  return (
    <main>
       {isInvoiceVisible ? (
       <InvoiceForm data={invoiceData} onClose={handleInvoiceClose} />
      ) : (
        <>
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
        <button type="button" onClick={handleAddProduct}>Add Product</button>
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
  <label htmlFor="payMethod">Payment Method:</label>
  <Select
    id="payMethod"
    name="payMethod"
    options={options.payMethod}
    value={options.payMethod.find((opt) => opt.value === checkoutData.payMethod)}
    onChange={(selectedOption) =>
      setCheckoutData((prevData) => ({
        ...prevData,
        payMethod: selectedOption ? selectedOption.value : '',
      }))
    }
    required
  />
</div>
          <h2>Selected Products</h2>
          <div className="selected-products">
 
  <ul>
    {selectedProducts.map((product, index) => (
      <li key={product.value} style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: '1' }}>
          {product.label}
        </span>
        <span>
          Quantity:
          <button
            type="button"
            className="quantity-button"
            onClick={() => handleQuantityChange(index, 'decrement')}
          >
            -
          </button>
          {product.quantity}
          <button
            type="button"
            className="quantity-button"
            onClick={() => handleQuantityChange(index, 'increment')}
          >
            +
          </button>
        </span>
      </li>
    ))}
  </ul>
</div>

<div className="order-summary">
  <h2>Order Summary</h2>
  <p>Total Amount: ${calculateTotalAmount().toFixed(1)}</p>

  {/* Payment input based on the selected payment method */}
  {checkoutData.payMethod === 'Cash' && (
    <>
      <div className="form-group">
        <label htmlFor="cashInput">Cash Amount:</label>
        <input
          type="number"
          id="cashInput"
          name="cashInput"
          value={cashInput}
          onChange={(e) => setCashInput(e.target.value)}
          required
        />
      </div>
      <p>
        Paid Amount: ${cashInput}{' '}
        {cashInput < calculateTotalAmount() && (
          <span style={{ color: 'red' }}> (Insufficient amount)</span>
        )}
      </p>
      {cashInput > calculateTotalAmount() && (
        <p>Cash Back: ${cashInput - calculateTotalAmount()}</p>
      )}
    </>
  )}

  {checkoutData.payMethod === 'Card' && (
    <p>Paid Amount: ${calculateTotalAmount().toFixed(1)}</p>
  )}
</div>



<button type="submit" onClick={handleFormSubmit} >
  Submit Order
</button>


        </form>
      </div>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Enter Quantity</h2>
            <p>Max Quantity: {checkoutData.product.value.quantity}</p>
            <input
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              min="1"
            />
            <div className="modal-buttons">
              <button type="button" onClick={handleQuantityInput}>Add</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>   
      )}

{isConfirmationOpen && (
        <ConfirmationDialog
          message="Are you sure you want to remove this product?"
          onConfirm={() => handleConfirmation(true)}
          onCancel={() => handleConfirmation(false)}
        />
      )}

{isSuccessDialogOpen && (
  <div className="modal-overlay">
    <div className="modal success-dialog">
      <p>Order created successfully!</p>
      <button onClick={() => setIsSuccessDialogOpen(false)}>Close</button>
    </div>
  </div>
)}

{isErrorDialogOpen && (
  <div className="modal-overlay">
    <div className="modal error-dialog">
      <p>Error creating order. Please try again later.</p>
      <button onClick={() => setIsErrorDialogOpen(false)}>Close</button>
    </div>
  </div>
)}

      </>
      )}

    </main>
  );
};

export default Checkout;
