import React, { useState } from 'react';

const Products = () => {
  const productList = [
    {
      barcode: '123456789',
      productName: 'Sample Product 1',
      importPrice: '$50.00',
      retailPrice: '$80.00',
      category: 'Sample Category A',
      creationDate: '2023-12-01',
    },
    {
      barcode: '987654321',
      productName: 'Sample Product 2',
      importPrice: '$40.00',
      retailPrice: '$70.00',
      category: 'Sample Category B',
      creationDate: '2023-11-25',
    },
    // Add more product items as needed
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productList);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = productList.filter(
      (product) =>
        product.barcode.toLowerCase().includes(query) ||
        product.productName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.creationDate.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  };

  return (
    <>
      <main>
      <div className="breadcrumb-list">
      <span>{'Home ->'}</span>
      <ul className="breadcrumb">
        <li>
          <a >Products</a>
        </li>
      </ul>
    </div>
        <div className="new-users">
          <h2>Search</h2>
          <input
            type="text"
            placeholder="Search products..."
            className="full-width-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div class="list-order-product">
          <h2>Products List</h2>
          <table>
            <thead>
              {/* ... table headers ... */}
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.barcode}</td>
                  <td>{product.productName}</td>
                  <td>{product.importPrice}</td>
                  <td>{product.retailPrice}</td>
                  <td>{product.category}</td>
                  <td>{product.creationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Products;
