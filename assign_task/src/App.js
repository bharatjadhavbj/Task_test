import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from './Component/Login';
import { FaStar } from 'react-icons/fa';
import { addToCart, removeFromCart } from './Redux/cartSlice';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleLogin = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const showFullDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  return (
    <div className="container mx-auto p-4">
      {isAuthenticated ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome back, {username}!</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Cart Section */}
          <h2 className="text-xl font-semibold mt-4">Your Cart:</h2>
          {cartItems.length > 0 ? (
            <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between p-2 border-b">
                  <span>{item.title} - <span className="font-bold">${item.price}</span></span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}

          <h2 className="text-xl font-semibold mt-4">Products:</h2>
          {data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((product) => (
                <div className="bg-white rounded-lg shadow-lg p-4 h-full hover:shadow-xl transition-shadow duration-300" key={product.id}>
                  <img className="h-48 w-full object-contain mb-2" src={product.image} alt={product.title} />
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-gray-700">Price: <span className="font-bold">${product.price}</span></p>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          color={index < product.rating.rate ? '#ffc107' : '#e4e5e9'}
                        />
                      ))}
                    </div>
                    <span className="text-sm">({product.rating.count} reviews)</span>
                  </div>
                  <p className="text-gray-600 flex-1">
                    {expandedDescriptions[product.id] || product.description.length <= 50
                      ? product.description
                      : `${product.description.slice(0, 100)}...`}
                    {product.description.length > 50 && (
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => showFullDescription(product.id)}
                      >
                        {expandedDescriptions[product.id] ? ' ..See less' : ' ..See more'}
                      </span>
                    )}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
