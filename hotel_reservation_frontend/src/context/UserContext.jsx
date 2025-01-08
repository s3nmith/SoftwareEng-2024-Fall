import { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// Create a Context for user data
export const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Add PropTypes validation for the children prop
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
