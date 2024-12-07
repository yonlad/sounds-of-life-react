// src/components/CalendarGrid.js
import React from 'react';
import CalendarDay from './CalendarDay';
import { generateCalendarData } from '../utils/calendarUtils';

const CalendarGrid = ({ onDateClick, onYellowNumberClick }) => {
  const calendarData = generateCalendarData();
  
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        margin: '0 auto',
        maxWidth: '94%',
        padding: '20px',
        cursor: 'move',
        boxSizing: 'border-box',
      }}
    >
      {calendarData.map((day, index) => (
        <CalendarDay 
          key={index}
          {...day}
          onDateClick={onDateClick}
          onYellowNumberClick={onYellowNumberClick}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;