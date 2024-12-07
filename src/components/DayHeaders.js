// src/components/DayHeaders.js
import React from 'react';

export const DayHeaders = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    maxWidth: '94%',
    margin: '0 auto',
    padding: 0,
  }}>
    {[
      { day: 'S', id: 'sun' },
      { day: 'M', id: 'mon' },
      { day: 'T', id: 'tue' },
      { day: 'W', id: 'wed' },
      { day: 'T', id: 'thu' },
      { day: 'F', id: 'fri' },
      { day: 'S', id: 'sat' }
    ].map(({ day, id }) => (
      <div 
        key={id}
        style={{
          textAlign: 'center',
          fontSize: '18px',
          color: 'white',
          paddingBottom: '0px',
        }}
      >
        {day}
      </div>
    ))}
  </div>
);

export default DayHeaders;