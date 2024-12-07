// src/components/CalendarHeader.js
import React from 'react';

// CalendarHeader Component
export const CalendarHeader = ({ onTitleClick }) => (
  <div style={{
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'serif',
  }}>
    <h1 
      onClick={onTitleClick}
      style={{
        fontSize: '2.5rem',
        marginTop: '20px',
        marginBottom: '10px',
        cursor: 'help',
        fontFamily: 'serif',
      }}
    >
      <strong>sounds of life</strong>
    </h1>
    <h2 style={{
      fontSize: '1.8rem',
      marginBottom: '5px',
      fontFamily: 'serif',
    }}>
      <strong>a calendar of <em>hope</em></strong>
    </h2>
    <h3 style={{
      fontSize: '1.2rem',
      marginBottom: '20px',
      fontFamily: 'serif',
    }}>
      <strong>september - october ????</strong>
    </h3>
  </div>
);

export default CalendarHeader;