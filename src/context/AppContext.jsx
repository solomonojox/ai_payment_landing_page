/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useState } from "react";
import useSessionStorage from "../hooks/useSessionStorage";
import ConsumeApi from "../core/ConsumeApi";
import { showNotification } from "../utilities/Notification/Noty";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const ContextProvider = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [Category, setCategory] = useSessionStorage("category", "all");
  const [menu, setMenu] = useSessionStorage("menu", "home");
  const [cart, setCart] = useSessionStorage("cart", []);
  const [wishlist, setWishlist] = useSessionStorage("wishlist", []);
  const [isCartPopupVisible, setCartPopupVisible] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [customFilters, setCustomFilters] = useState([]);
  const [user, setUser] = useSessionStorage('user', {});


  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState("");

  const showOverlay = (color = "flushOrange-600") => {
    setOverlayColor(color);
    setIsOverlayVisible(true);
  };
  const hideOverlay = () => setIsOverlayVisible(false);

  React.useEffect(() => {
    if (Object.keys(user).length > 0) {
      console.log("Updated user state:", user);
    }
  }, [user]);

  const logout = () => {
    setUser({});
    localStorage.removeItem('user');
    showNotification('Logged out successfully!', 'info');
  };



  function formatNumberWithCommas(number) {
    // console.log(typeof number)
    number = Number(number);
    var res = number.toLocaleString(undefined, { maximumFractionDigits: 0 });
    // console.log("resulting number",res);
    return res
  }

  const extractErrorMessage = (errorData) => {
    if (typeof errorData === 'string') {
      const match = errorData.match(/--\s*(.*?)\s*Severity:/); // Extracts the message between "--" and "Severity:"
      return match ? match[1] : "Validation failed. Please check your input.";
    }
    return "An unexpected error occurred.";
  };

  useEffect(() => {
    filterProducts();
  }, []);

  const filterProducts = () => {
    let filtered = products;
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (priceRange.min !== 0 || priceRange.max !== 1000) {
      filtered = filtered.filter(product =>
        product.price >= priceRange.min && product.price <= priceRange.max
      );
    }
    if (rating !== 0) {
      filtered = filtered.filter(product =>
        product.rating >= rating
      );
    }
    customFilters.forEach(({ filterFn }) => {
      filtered = filtered.filter(filterFn);
    });
    setFilteredProducts(filtered);
  };

  const filterBy = (key, filterFn) => {
    setCustomFilters(prevFilters => [...prevFilters, { key, filterFn }]);
  };

  const removeFilter = (key) => {
    setCustomFilters(prevFilters => prevFilters.filter(filter => filter.key !== key));
  };

  const addToWishlist = (item, quantity = 1) => {
    setWishlist((prev) => {
      try {
        const existingItemIndex = prev.findIndex(
          (wish) => wish.itemId === item.itemId
        );

        if (existingItemIndex !== -1) {
          const updatedWish = [...prev];
          updatedWish[existingItemIndex].quantity += quantity;
          showNotification(`${item.itemName} added to wishlist`, "info");
          return updatedWish;
        } else {
          showNotification(`${item.itemName} added to wishlist`, "info");
          return [...prev, { ...item, quantity }];
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        return prev;
      }
    });
  };


  const login = async (email, password) => {
    try {
      const response = await ConsumeApi('/api/Customers/Login', 'POST', { email, password });

      if (response && response.Status) {
        console.log("Original Data from API:", response);
        console.log("Data to be set in user:", response.Data);
        setUser(response.Data); // Set user state
        showNotification('Login successful!', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        console.error('Login failed:', response);
        showNotification('Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      showNotification('Something went wrong. Please try again later.', 'error');
    }
  };


  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      try {
        const existingItemIndex = prevCart.findIndex(
          (cartItem) => cartItem.itemId === item.itemId
        );

        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          showNotification(`${item.itemName} added to cart`);
          return updatedCart;
        } else {
          showNotification(`${item.itemName} added to cart`);
          return [...prevCart, { ...item, quantity }];
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        return prevCart;
      }
    });

    if (checkIfInWishlist(item.itemId)) {
      removeFromWishlist(item);
    }
  };

  const getItemQuantityInWishlist = (item) => {
    const foundItem = wishlist.find((wishItem) => wishItem.itemId === item.itemId);
    return foundItem ? foundItem.quantity : 0;
  };

  const removeFromWishlist = (item) => {
    setWishlist((prev) =>
      prev.filter((wishItem) => wishItem.itemId !== item.itemId)
    );
    showNotification(`${item.itemName} removed from wishlist`, "warning");
  };

  const checkIfInWishlist = (itemId) => {
    return wishlist.some((wishItem) => wishItem.itemId === itemId);
  };

  const getItemQuantityInCart = (item) => {
    const foundItem = cart.find((cartItem) => cartItem.itemId === item.itemId);
    return foundItem ? foundItem.quantity : 0;
  };

  const checkIfInCart = (itemId) => {
    return cart.some((cartItem) => cartItem.itemId === itemId);
  };

  const showCartPopup = () => {
    setCartPopupVisible(true);
  };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.itemId !== item.itemId)
    );
    showNotification(`${item.itemName} removed from cart`, "warning");
  };

  const clearCart = () => {
    setCart([]);
  };

  const spreadItemTags = (item) => {
    if (item.itemTags && item.itemTags.length > 0) {
      return item.itemTags.join(" ");
    } else {
      return "None";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  function getInitials(phrase) {
    return phrase
      .split(' ') // Split the phrase into words
      .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word and convert to uppercase
      .join(''); // Join the initials together
  }

  const contextValue = {
    user,
    Category,
    setCategory,
    menu,
    setMenu,
    showCartPopup,
    login,
    logout,
    cart,
    getItemQuantityInCart,
    spreadItemTags,
    checkIfInWishlist,
    removeFromWishlist,
    getItemQuantityInWishlist,
    addToWishlist,
    wishlist,
    addToCart,
    showNotification,
    removeFromCart,
    clearCart,
    products: filteredProducts,
    checkIfInCart,
    formatCurrency: (number) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(number),
    isCartPopupVisible,
    setSearchQuery,
    searchQuery,
    priceRange,
    setPriceRange,
    rating,
    setRating,
    availability,
    setAvailability,
    filterBy,
    removeFilter,
    isOverlayVisible,
    overlayColor,
    showOverlay,
    hideOverlay,
    formatNumberWithCommas,
    extractErrorMessage,
    formatDate,
    getInitials,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
