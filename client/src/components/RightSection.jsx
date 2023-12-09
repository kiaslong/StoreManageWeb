import React, { useContext, useState ,useEffect,useRef} from 'react';
import { AuthContext } from '../context/AuthContext';
import defaultAvatar from '../assets/default_logo_user.png';
import axios from 'axios';
import { useEditIndex } from '../context/EditContext';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonIcon from '@mui/icons-material/Person';

const RightSection = ({ selectedContext, handleSelectedComponent }) => {
  const { currentUser } = useContext(AuthContext);
  const { editIndex, editProduct,setEditIndex,setEditProduct} = useEditIndex();
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef(null);
 
  const [product, setProduct] = useState({
    productName: '',
    importPrice: '',
    retailPrice: '',
    category: '',
    quantity: '',
    productImage: null,
  });

  useEffect(() => {
    if (editProduct) {
      setProduct(editProduct);
      setImagePreview(`http://localhost:8080/${editProduct.imageUrl}`);
    }else{
      setProduct({
        productName: '',
        importPrice: '',
        retailPrice: '',
        category: '',
        quantity: '',
        productImage: null,
      })
    }
  }, [editProduct]);
  

  
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setProduct({
        ...product,
        productImage: file,
      });
    } else {
      setImagePreview(null);
      setProduct({
        ...product,
        productImage: null,
      });
    }
  };



  const handleCancelEdit = () => {
    setEditIndex(-1);
    setEditProduct(null);
    setProduct({
      productName: '',
      importPrice: '',
      retailPrice: '',
      category: '',
      quantity: '',
      productImage: null,
    });
    setImagePreview('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('productImage', product.productImage); 
      formData.append('productName', product.productName);
      formData.append('importPrice', product.importPrice);
      formData.append('retailPrice', product.retailPrice);
      formData.append('category', product.category);
      formData.append('quantity', product.quantity);
      

      if (editIndex !== -1) {
        const response = await axios.put(`http://localhost:8080/products/${product.barcode}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 200) {
          setErrorMessage(`Product updated successfully`);
          setShowErrorModal(true);
          setProduct({
            productName: '',
            importPrice: '',
            retailPrice: '',
            category: '',
            quantity: '',
            productImage: '',
          });
          setImagePreview('')
          setEditIndex(-2);
          setEditProduct(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setTimeout(() => {
            setShowErrorModal(false);
          }, 1500);
        }
      } else {
        const response = await axios.post('http://localhost:8080/products/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 201) {
          setErrorMessage(`New product added successfully`);
          setShowErrorModal(true);
       
        
          setProduct({
            productName: '',
            importPrice: '',
            retailPrice: '',
            category: '',
            quantity: '',
            productImage: '',
          });
          setImagePreview('')
          setEditIndex(-2);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setTimeout(() => {
            setShowErrorModal(false);
          }, 1500);
        }
      }
    } catch (error) {
      setErrorMessage(`${error.response.data.message}`);
      setShowErrorModal(true);
    }
  };

  // Fetch product list function - Replace with your own logic

  return (
    <div className="right-section">
      <div className="nav">
        <div className="profile">
          <p>Hi, <b>{currentUser?.user?.fullname || ''}</b></p>
          <div className="profile-photo">
            <img
              src={currentUser.user.profilePhotoURL !== '' ? `http://localhost:8080/${currentUser.user.profilePhotoURL}` : defaultAvatar}
              alt=""
              srcSet=""
            />
          </div>
        </div>
        <aside className="settings">
          <div className="sidebar">
            <a onClick={() => handleSelectedComponent('ChangePassword')}>
            <LockResetIcon/>
              Change Password
            </a>
            <a onClick={() => handleSelectedComponent('EditProfile')}>
            <PersonIcon/>
              Edit Profile
            </a>
          </div>
        </aside>
        {selectedContext && selectedContext  === 'Products' && (!currentUser || currentUser.user.username === 'admin') ? (
          <div className="add-product">
            <div className="header">
            <h2>{editIndex !== -1 ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <form

            onSubmit={handleSubmit}
          >
              <div className="main-product-info">
                <div className="product-name">
                  <label htmlFor="productName">Product Name:</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    placeholder="Enter product name"
                    value={product.productName}
                    onChange={(e) =>  setProduct({
                      ...product,
                      productName: e.target.value,
                    })}
                  />
                </div>
                <div className="product-price">
                  <label htmlFor="importPrice">Import Price:</label>
                  <input
                    type="text"
                    id="importPrice"
                    name="importPrice"
                    placeholder="Enter import price"
                    value={product.importPrice}
                    onChange={(e) =>  setProduct({
                      ...product,
                      importPrice: e.target.value,
                    })}
                  />
                </div>
                <div className="product-price">
                  <label htmlFor="retailPrice">Retail Price:</label>
                  <input
                    type="text"
                    id="retailPrice"
                    name="retailPrice"
                    placeholder="Enter retail price"
                    value={product.retailPrice}
                    onChange={(e) =>  setProduct({
                    ...product,
                    retailPrice: e.target.value,
                  })}
                  />
                </div>
                <div className="product-category">
                  <label htmlFor="category">Product Category:</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Enter product category"
                    value={product.category}
                  onChange={(e) =>  setProduct({
                    ...product,
                    category: e.target.value,
                  })}
                  />
                </div>
                <div className="product-quantity">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={product.quantity}
                  onChange={(e) =>  setProduct({
                    ...product,
                    quantity: e.target.value,
                  })}
                />
              </div>
                <div className="product-image">
                  <label htmlFor="productImage">Product Image:</label>
                  <input
                    type="file"
                    id="productImage"
                    name="productImage"
                    accept="image/*"
                    ref={fileInputRef}  
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        border: '1px solid #ccc',
                      }}
                    />
                  )}
                </div>
                <div className="form-buttons">
                <button type="submit">
                  {editIndex !== -1 ? 'Update Product' : 'Add Product'}
                </button>
                {editIndex !== -1 && (
                  <button  style={{ background: 'linear-gradient(to left, #b1130d, #c90202)' }} type="button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
              </div>
            </form>
          </div>
        ):null}
      </div>
      {showErrorModal && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="close" onClick={() => setShowErrorModal(false)}>&times;</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSection;
