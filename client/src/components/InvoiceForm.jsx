import React , { useRef } from 'react';
import '../scss/InvoiceForm.scss'; 
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const InvoiceForm = ({ data , onClose}) => {
  const invoiceRef = useRef(null);

  const generatePDF = () => {
    const input = invoiceRef.current;
  
    if (input) {
      console.log('Generating PDF...');
  
      const imageElements = input.getElementsByClassName('product-image-invoice');
      console.log('Number of images:', imageElements.length);
  
      const textContent = `
        Invoice
        Order Details: ${data.fullName} - ${data.phoneNum}
        Phone Number: ${data.phoneNum}
        Full Name: ${data.fullName}
        Address: ${data.address}
        Products:
        ${data.products
          .map(
            (product, index) => `
              Barcode - ${product.value.barcode}
              ProductName: ${product.value.productName}
              Quantity: ${product.quantity}
              Price: $${product.value.retailPrice}
            `
          )
          .join('\n')}
        Total Amount: $${data.totalAmount}
        Creation Date: ${data.date}
      `;
  
      const textPromise = new Promise((resolve) => {
        resolve({ type: 'text', data: textContent });
      });
  
      const promises = Array.from(imageElements).map((img) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.crossOrigin = '';
          image.src = img.src;
          image.onload = () => {
            console.log('Image loaded:', img.src);
            resolve({ type: 'image', data: image });
          };
          image.onerror = (error) => {
            console.error('Error loading image:', img.src, error);
            resolve({ type: 'image', data: null }); // Resolve with null image to avoid breaking Promise.all
          };
        });
      });
  
      Promise.all([textPromise, ...promises]).then((contents) => {
        console.log('Number of loaded contents:', contents.length);
      
        const pdf = new jsPDF('p', 'mm', 'a4');
      
        let yOffset = 15; // Initial Y-coordinate
      
        contents.forEach((content) => {
          if (content.type === 'text') {
            pdf.text(content.data, 19, yOffset); // Adjust the coordinates based on your layout
            yOffset += 50; // Adjust the vertical spacing between text and image
          } else if (content.type === 'image') {
            const { data } = content;
      
            // Resize the image to fit within the PDF page
            const maxWidth = 20; // Adjust this value based on your layout
            const maxHeight = 20; // Adjust this value based on your layout
            const scaleFactor = Math.min(maxWidth / data.width, maxHeight / data.height);
            const width = data.width * scaleFactor;
            const height = data.height * scaleFactor;
      
            pdf.addImage(data, 'PNG', 15, yOffset, width, height); 
            yOffset += height + 20;
          }
        });
      
        pdf.save('invoice.pdf');
      });

    } else {
      console.error('Cannot find element with ID "invoice-form".');
    }
  };
  
  
  
  
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
  
    <div className="invoice-form" id="invoice-form" ref={invoiceRef}>
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
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
    </>
  );
};

export default InvoiceForm;
