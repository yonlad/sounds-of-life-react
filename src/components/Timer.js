import React from 'react';

const Timer = ({ value }) => {
  // Format the timer value to always show three digits
  const formattedValue = String(Math.max(0, value)).padStart(3, '0');
  
  return (
    <div 
      style={{
        position: 'absolute',
        right: '5%',
        top: '15%',
        transform: 'translateY(-50%)',
        fontSize: '32px',
        fontFamily: 'Cambria, serif',
        padding: '15px 30px',
        letterSpacing: '8px',
        color: 'white',
        zIndex: 1000,
      }}
    >
      {formattedValue}
    </div>
  );
};

export default Timer;