import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  return (
    <DateContext.Provider
      value={{
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

DateProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};
