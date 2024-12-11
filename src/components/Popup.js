import React, { useState, useRef, useEffect } from 'react';
import SoundTimestamp from './SoundTimestamp';

const Popup = ({ type, date, style, onClose }) => {
  const isRed = type === 'red';
  const [progress, setProgress] = useState(0);
  const [activeTimestamp, setActiveTimestamp] = useState(null);
  const progressBarRef = useRef(null);
  const popupId = useRef(`popup-${Date.now()}`);

  // Handle progress bar click for seeking
  const handleProgressBarClick = (e) => {
    if (window.GlobalAudioController?.activeAudio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = clickX / rect.width;
      window.GlobalAudioController.activeAudio.currentTime = 
        ratio * window.GlobalAudioController.activeAudio.duration;
    }
  };

  // Update active timestamp when audio changes
  useEffect(() => {
    const updateActiveState = () => {
      const currentTimestamp = window.GlobalAudioController?.activeTimestamp;
      if (currentTimestamp && currentTimestamp.includes(date)) {
        // Extract time from timestamp (e.g., "2024-09-01-06:06" -> "06:06")
        const time = currentTimestamp.split('-').slice(-2).join(':');
        setActiveTimestamp(time);
      } else {
        setActiveTimestamp(null);
      }
    };

    const intervalId = setInterval(updateActiveState, 100);
    return () => clearInterval(intervalId);
  }, [date]);

  // Track audio progress
  useEffect(() => {
    const updateProgress = () => {
      const audio = window.GlobalAudioController?.activeAudio;
      if (audio && !audio.paused && isFinite(audio.duration)) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
      } else {
        setProgress(0);
      }
    };

    const handleAudioEnd = () => {
      setProgress(0);
      setActiveTimestamp(null);
    };

    // Add ended event listener to the audio
    const audio = window.GlobalAudioController?.activeAudio;
    if (audio) {
      audio.addEventListener('ended', handleAudioEnd);
    }

    const progressInterval = setInterval(updateProgress, 100);

    return () => {
      clearInterval(progressInterval);
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '325px',
        backgroundColor: 'rgb(220, 220, 220)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        cursor: 'move',
        ...style,
      }}
    >
      <div 
        style={{
          padding: '20px',
          textAlign: 'center',
          position: 'relative',
          height: '100%',
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
            color: 'rgb(250, 250, 250)',
          }}
        >
          ×
        </span>

        <h3 
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            color: 'black',
          }}
        >
          {`<  >`/* isRed ? `${date}` : `${date}` */}
        </h3>

        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          {['06:06', '12:12', '18:18', '00:00'].map(time => (
            <SoundTimestamp
              key={time}
              time={time}
              date={date}
              isActive={time === activeTimestamp}
              suppressProgressBar={true}
              onProgress={setProgress} // In your Popup component
            />
          ))}
        </div>

        {/* Single progress bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          style={{
            width: '100%',
            backgroundColor: '#ddd',
            height: '20px',
            marginBottom: '10px',
            cursor: 'e-resize',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              position: 'absolute',
              left: 0,
              top: 0,
              transition: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Popup;