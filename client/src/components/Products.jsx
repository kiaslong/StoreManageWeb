import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useEditIndex } from '../context/EditContext';


const Products = () => {
  const { currentUser } = useContext(AuthContext);
  const { editIndex, setEditIndex,setEditProduct } = useEditIndex();
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(7);
 


  const handleEditProduct = (barcode) => {
    const index = productList.findIndex((product) => product.barcode === barcode);
  
    if (editIndex === barcode) {
      
      setEditIndex(-1);
      setEditProduct(null);
    } else {
      
      setEditIndex(barcode);
      setEditProduct(productList[index]);
    }
  };
  
  const handleDeleteProduct = (barcode) => {
    
    setProductToDelete(barcode);
    setDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
  
    setProductToDelete(null);
    setDeleteConfirmation(false);
  };


  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/products/${productToDelete}`);
      if (response.status === 200) {
        const updatedProductList = productList.filter((product) => product.barcode !== productToDelete);
        setProductList(updatedProductList);
        setFilteredProducts(updatedProductList);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      
      setProductToDelete(null);
      setDeleteConfirmation(false);
    }
  };


  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        setProductList(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    if(editIndex === -2 ) {
      fetchProducts();
      setEditIndex(-1)
    }


    fetchProducts();
  }, [editIndex]); 

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main>
      <div className="breadcrumb-list">
        <span>{'Home ->'}</span>
        <ul className="breadcrumb">
          <li>
            <a>Products</a>
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

      <div className="list-order-product">
  <h2>Products List</h2>
  <Pagination

          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
          paginate={paginate}
        />
  <table>
    <thead>
      <tr>
        <th>Product Image</th>
        <th>Barcode</th>
        <th>Product Name</th>
       {currentUser?.user?.username === 'admin' && <th>Import Price</th>}
        <th>Retail Price</th>
        <th>Quantity</th>
        <th>Category</th>
        <th>Creation Date</th>
        {currentUser?.user?.username === 'admin' && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {currentProducts.map((product, index) => (
        <tr key={index}>
          <td>
            {product.imageUrl && (
              <img src={`http://localhost:8080/${product.imageUrl}`} style={{ width: '70px', height: '60px' }} />
            )}
          </td>
          <td>{product.barcode}</td>
          <td>{product.productName}</td>
          {currentUser?.user?.username === 'admin'&& <td>${product.importPrice}</td>}
          <td>${product.retailPrice}</td>
          <td>{product.quantity}</td>
          <td>{product.category}</td>
          <td>{new Date(product.creationDate).toLocaleDateString('en-GB')}</td>
          {currentUser?.user?.username === 'admin' && (
                  <td>
                    <button onClick={() => handleEditProduct(product.barcode)}>Edit</button>
                    <button
                      onClick={() => handleDeleteProduct(product.barcode)}
                      style={{ background: 'red' }}
                    >
                      Delete
                    </button>
                  </td>
                )}
        </tr>
      ))}
    </tbody>
  </table>
  
</div>

{deleteConfirmation && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete-content">
            <p>Are you sure you want to delete this product?</p>
            <button onClick={handleCancelDelete}>Cancel</button>
            <button onClick={handleConfirmDelete}>Delete</button>
          </div>
        </div>
      )}


    </main>
  );
};

const Pagination = ({ productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul className="pagination">
      <p>Pages:</p>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Products;
