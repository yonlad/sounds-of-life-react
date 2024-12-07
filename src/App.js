import React, { useState, useEffect } from 'react';
import CalendarHeader from './components/CalendarHeader';
import Timer from './components/Timer';
import DayHeaders from './components/DayHeaders';
import CalendarGrid from './components/CalendarGrid';
import Popup from './components/Popup';
import YellowPopup from './components/YellowPopup';
import HeaderPopup from './components/HeaderPopup';

const App = () => {
  const [timeLeft, setTimeLeft] = useState(180);
  const [popups, setPopups] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  //const timerRef = useRef(null);

  // Timer effect with new redirect behavior
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          // Clear the interval
          clearInterval(timer);
          
          // Open original calendar and close this one
          window.location.replace('http://localhost:8001/sounds-of-life.html?v=2'); // bring back to http://localhost:8001/sounds-of-life.html once uploading the website to internet
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  
  const addPopup = (popupData) => {
    const newPopup = {
      ...popupData,
      id: Date.now(),
      zIndex: nextZIndex
    };
    
    setPopups(current => [...current, newPopup]);
    setNextZIndex(current => current + 1);
    return newPopup.id;
  };

  const removePopup = (popupId) => {
    setPopups(current => current.filter(popup => popup.id !== popupId));
  };

  const handleDateClick = (date, type) => {
    addPopup({
      type: 'date',
      date: date,
      dateType: type,
    });
  };

  const handleYellowNumberClick = (number) => {
    addPopup({
      type: 'yellow',
      number: number,
    });
  };

  const handleHeaderClick = () => {
    addPopup({
      type: 'header'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      color: 'white',
      transform: 'scale(0.90)',
      transformOrigin: 'top center',
      height: '111.111vh',
      width: '100%',
      overflowX: 'hidden',
      cursor: 'none',
    }}>
      <CalendarHeader onTitleClick={handleHeaderClick} />
      <Timer value={timeLeft} />
      <DayHeaders />
      <CalendarGrid 
        onDateClick={handleDateClick}
        onYellowNumberClick={handleYellowNumberClick}
      />
      
      {popups.map(popup => {
        if (popup.type === 'date') {
          return (
            <Popup
              key={popup.id}
              type={popup.dateType}
              date={popup.date}
              style={{ zIndex: popup.zIndex }}
              onClose={() => removePopup(popup.id)}
            />
          );
        } else if (popup.type === 'yellow') {
          return (
            <YellowPopup
              key={popup.id}
              number={popup.number}
              style={{ zIndex: popup.zIndex }}
              onClose={() => removePopup(popup.id)}
            />
          );
        } else if (popup.type === 'header') {
          return (
            <HeaderPopup
              key={popup.id}
              style={{ zIndex: popup.zIndex }}
              onClose={() => removePopup(popup.id)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default App;