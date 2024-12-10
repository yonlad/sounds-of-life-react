import React, { useState, useEffect, useRef } from 'react';
import { textServices } from '../firebase/services';

const yellowTitles = {
  '331': 'September 1st',
  '332': 'September 2nd',
  '333': 'September 3rd',
  '334': 'September 4th',
  '335': 'September 5th',
  '336': 'September 6th',
  '337': 'September 7th',
  '338': 'September 8th',
  '339': 'September 9th',
  '340': 'September 10th',
  '341': 'September 11th',
  '342': 'September 12th',
  '343': 'September 13th',
  '344': 'September 14th',
  '345': 'September 15th',
  '346': 'September 16th',
  '347': 'September 17th',
  '348': 'September 18th',
  '349': 'September 19th',
  '350': 'September 20th',
  '351': 'September 21st',
  '352': 'September 22nd',
  '353': 'September 23rd',
  '354': 'September 24th',
  '355': 'September 25th',
  '356': 'September 26th',
  '357': 'September 27th',
  '358': 'September 28th',
  '359': 'September 29th',
  '360': 'September 30th',
  '361': 'October 1st',
  '362': 'October 2nd',
  '363': 'October 3rd',
  '364': 'October 4th',
  '365': 'October 5th',
};

const YellowPopup = ({ number, style, onClose }) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const getRandomDimensions = () => {
    const minWidth = 300;
    const maxWidth = 700;
    const minHeight = 200;
    const maxHeight = 400;
    
    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const maxLeft = viewportWidth - width;
    const maxTop = viewportHeight - height;
    
    const left = Math.floor(Math.random() * maxLeft);
    const top = Math.floor(Math.random() * maxTop);
    
    return { width, height, left, top };
  };

  const dimensions = React.useMemo(getRandomDimensions, []);


  // Load text from Firebase
  useEffect(() => {
    let mounted = true;

    const fetchText = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const text = await textServices.getText(number);
        if (mounted) {
          setText(text);
          setIsEditing(!text);
        }
      } catch (err) {
        console.error('Error fetching text:', err);
        if (mounted) {
          setError('Failed to load text. Please try again.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchText();
    return () => { mounted = false; };
  }, [number]);

  const handleSubmit = async () => {
    try {
      setError(null);
      const success = await textServices.saveText(number, text);
      if (success) {
        setIsEditing(false);
      } else {
        setError('Failed to save text');
      }
    } catch (err) {
      console.error('Error saving text:', err);
      setError('Failed to save text');
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };
  

  if (isLoading) {
    return (
      <div style={{
        ...dimensions,
        position: 'fixed',
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        ...style,
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${dimensions.left}px`,
        top: `${dimensions.top}px`,
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        cursor: 'move', // or none???
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <span 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '20px',
          fontSize: '24px',
          cursor: 'crosshair',
          color: 'white',
          padding: '10px',
        }}
      >
        ×
      </span>

      <h3 style={{
        color: 'white',
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        {yellowTitles[number]}
      </h3>

      {error ? (
        <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>
      ) : (
        <div style={{ flex: 1, position: 'relative' }}>
          {isEditing ? (
            <>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  width: '100%',
                  height: 'calc(100% - 40px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  fontSize: '18px',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
                placeholder="Write your text here..."
              />
              <button
                onClick={handleSubmit}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  padding: '5px 15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Submit
              </button>
            </>
          ) : (
            <div
              onClick={handleEdit}
              style={{
                width: '100%',
                height: '100%',
                color: 'white',
                fontSize: '18px',
                cursor: 'text',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: '10px',
              }}
            >
              {text || 'Click to add text'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YellowPopup;