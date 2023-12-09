import React, { createContext, useContext, useState } from 'react';

const EditIndexContext = createContext();

export const useEditIndex = () => {
  const context = useContext(EditIndexContext);
  if (!context) {
    throw new Error('useEditIndex must be used within an EditIndexProvider');
  }
  return context;
};

export const EditIndexProvider = ({ children }) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editProduct,setEditProduct] = useState(null);

  const value = {
    editIndex,
    setEditIndex,
    editProduct,
    setEditProduct,
  };

  return (
    <EditIndexContext.Provider value={value}>{children}</EditIndexContext.Provider>
  );
};
