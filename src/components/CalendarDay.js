// src/components/CalendarDay.js
import React from 'react';
import { tooltipContent } from '../utils/calendarUtils';  // Add this import

const CalendarDay = ({ yellowNumber, displayDate, type, date, onDateClick, onYellowNumberClick }) => {
  const handleDateClick = () => {
    if (type !== 'grey' && onDateClick) {
      onDateClick(date, type);
    }
  };

  const handleYellowClick = (e) => {
    e.stopPropagation();
    if (onYellowNumberClick) {
      onYellowNumberClick(yellowNumber);
    }
  };

  const getDateStyles = () => {
    const baseStyles = {
      fontSize: '20px',
      fontFamily: 'Cambria, serif',
    };

    switch (type) {
      case 'red':
        return {
          ...baseStyles,
          color: 'red',
          cursor: 'zoom-in',
        };
      case 'grey':
        return {
          ...baseStyles,
          color: 'grey',
          cursor: 'not-allowed',
        };
      case 'white':
        return {
          ...baseStyles,
          color: 'white',
          cursor: 'alias',
        };
      default:
        return baseStyles;
    }
  };

  // Get tooltips from tooltipContent
  const dateTooltip = tooltipContent[date];
  const yellowTooltip = tooltipContent[yellowNumber];

  return (
    <div 
      style={{
        position: 'relative',
        border: '1px solid white',
        height: '120px',
        fontSize: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Yellow Number with Tooltip */}
      {yellowNumber && (
        <span
          onClick={handleYellowClick}
          style={{
            position: 'absolute',
            top: '5px',
            left: '10px',
            fontSize: '20px',
            color: 'yellow',
            cursor: 'wait',
            fontFamily: 'Cambria, serif',
          }}
          className="hover:text-yellow-200"
          title={yellowTooltip} // Add tooltip here
        >
          {yellowNumber}
        </span>
      )}

      {/* Date Number with Tooltip */}
      <span
        onClick={handleDateClick}
        style={getDateStyles()}
        data-date={date}
        className={type !== 'grey' ? 'hover:opacity-80' : ''}
        title={dateTooltip} // Add tooltip here
      >
        {displayDate}
      </span>
    </div>
  );
};

export default CalendarDay;