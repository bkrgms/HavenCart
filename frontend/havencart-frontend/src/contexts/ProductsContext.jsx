import React, { useState, createContext, useEffect } from 'react';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to load products:', response.status);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  return (
    <ProductsContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}; 