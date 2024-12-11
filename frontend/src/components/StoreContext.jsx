import { createContext, useState, useEffect } from "react";

// Create the context
export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Initialize the store from localStorage if available
  const [store, setStore] = useState(() => {
    const savedStore = localStorage.getItem("store");
    return savedStore ? JSON.parse(savedStore) : {};
  });

  // Initialise enablefade state from local storage
  const [enableFade, setEnableFade] = useState(
    JSON.parse(localStorage.getItem("enableFade")) || false
  );

  // Function to toggle the fade effect and sync with localStorage
  const toggleFade = (value) => {
    setEnableFade(value);
    localStorage.setItem("enableFade", JSON.stringify(value));
  };

  // Save store to localStorage whenever it changes
  useEffect(() => {
    if (store) {
      localStorage.setItem("store", JSON.stringify(store));
    }
  }, [store]);

  // Sync the `enableFade` state across tabs using the `storage` event
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key == "enableFade") {
        setEnableFade(JSON.parse(event.newValue));
      }
    };

    // Add event listener for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <StoreContext.Provider value={{ store, setStore, enableFade, toggleFade }}>
      {children}
    </StoreContext.Provider>
  );
};