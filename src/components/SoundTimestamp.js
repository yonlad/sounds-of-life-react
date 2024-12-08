import React, { useState, useRef, useEffect } from 'react';
import { audioBufferToWAV } from '../utils/audioUtils';

// Global audio controller to manage active timestamp across all instances
const GlobalAudioController = {
  activeTimestamp: null,
  activeAudio: null,
  activeAbortController: null,
  
  setActive(timestamp, audio, abortController) {
    this.cleanup();
    this.activeTimestamp = timestamp;
    this.activeAudio = audio;
    this.activeAbortController = abortController;
  },

  cleanup() {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }

    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.src = '';
        this.activeAudio = null;
      } catch (error) {
        console.error('Error cleaning up global audio:', error);
      }
    }
    
    this.activeTimestamp = null;
  }
};

const SoundTimestamp = ({ time, date, suppressProgressBar, onProgress }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showUploadPrompt, setShowUploadPrompt] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const audioRef = useRef(null);
    const fileInputRef = useRef(null);
    const progressBarRef = useRef(null);
    const timestampId = `${date}-${time}`;

    // Effect to sync state with GlobalAudioController
  useEffect(() => {
    const checkActiveState = () => {
      const isThisActive = GlobalAudioController.activeTimestamp === timestampId;
      
      if (isActive !== isThisActive) {
        setIsActive(isThisActive);
        setIsPlaying(isThisActive && GlobalAudioController.activeAudio && !GlobalAudioController.activeAudio.paused);
        
        // Reset hover state when becoming inactive
        if (!isThisActive) {
          setIsHovered(false);
        }
      }
      
      // Update progress only if this is the active timestamp
      if (isThisActive && GlobalAudioController.activeAudio) {
        const audio = GlobalAudioController.activeAudio;
        if (!audio.paused && isFinite(audio.duration)) {
          const currentProgress = (audio.currentTime / audio.duration) * 100;
          onProgress?.(currentProgress);
        }
      }
    };

    const interval = setInterval(checkActiveState, 10);
    return () => clearInterval(interval);
  }, [timestampId, onProgress, isActive]);

  const resetStates = () => {
    setIsPlaying(false);
    setIsActive(false);
    setProgress(0);
    setShowUploadPrompt(false);
    setIsHovered(false); // Also reset hover state
  };

  const handleMouseEnter = () => {
    if (!GlobalAudioController.activeTimestamp || GlobalAudioController.activeTimestamp !== timestampId) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!GlobalAudioController.activeTimestamp || GlobalAudioController.activeTimestamp !== timestampId) {
      setIsHovered(false);
    }
  };

  const cleanupCurrentAudio = async () => {
    if (audioRef.current) {
      try {
        const audio = audioRef.current;
        audio.onplay = null;
        audio.onended = null;
        audio.ontimeupdate = null;
        audio.onerror = null;
        await audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audioRef.current = null;
      } catch (error) {
        console.error('Error cleaning up audio:', error);
      }
    }
  };

  const playSound = async (soundFile) => {
    try {
      const audio = new Audio();
      audioRef.current = audio;
      
      // Register this as the active audio globally
      GlobalAudioController.setActive(timestampId, audio, null);

      audio.onerror = () => {
        if (GlobalAudioController.activeTimestamp === timestampId) {
          resetStates();
          setShowUploadPrompt(true);
        }
      };

      audio.onplay = () => {
        if (GlobalAudioController.activeTimestamp === timestampId) {
          setIsPlaying(true);
          setIsActive(true);
        }
      };

      audio.onended = () => {
        if (GlobalAudioController.activeTimestamp === timestampId) {
          resetStates();
        }
      };

      audio.ontimeupdate = () => {
        if (GlobalAudioController.activeTimestamp === timestampId && audio && isFinite(audio.duration)) {
          const currentProgress = (audio.currentTime / audio.duration) * 100;
          if (isFinite(currentProgress)) {
            setProgress(currentProgress);
          }
        }
      };

      audio.src = soundFile;
      await audio.load();
      
      if (GlobalAudioController.activeTimestamp === timestampId) {
        await audio.play();
      }
    } catch (error) {
      if (error.name !== 'AbortError' && GlobalAudioController.activeTimestamp === timestampId) {
        console.error('Error playing sound:', error);
        resetStates();
        setShowUploadPrompt(true);
      }
    }
  };

  const checkAndPlaySound = async (e) => {
    e.stopPropagation();

    const timestampId = `${date}-${time}`;

    // Check if this timestamp is already playing
    if (GlobalAudioController.activeTimestamp === timestampId) {
        // If it's already playing, show upload prompt to replace the sound
        GlobalAudioController.cleanup();
        resetStates();
        setShowUploadPrompt(true);
        setIsActive(true);
        return;
      }
    
    // Always cleanup global state first
    GlobalAudioController.cleanup();
    
    // Set this timestamp as active
    GlobalAudioController.activeTimestamp = timestampId;
    
    // Reset states immediately
    resetStates();
    await cleanupCurrentAudio();

    // If we're no longer the active timestamp, abort
    if (GlobalAudioController.activeTimestamp !== timestampId) return;

    const abortController = new AbortController();
    GlobalAudioController.activeAbortController = abortController;
    
    const soundFile = `http://localhost:8001/new-sounds/${date}-${time.replace(':', '-')}.m4a`;
    
    try {
      const response = await fetch(soundFile, { 
        method: 'HEAD',
        signal: abortController.signal
      });
      
      if (GlobalAudioController.activeTimestamp !== timestampId) return;
      
      if (response.ok) {
        await playSound(soundFile);
      } else {
        setShowUploadPrompt(true);
        setIsActive(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && GlobalAudioController.activeTimestamp === timestampId) {
        console.error('Error checking sound file:', error);
        setShowUploadPrompt(true);
        setIsActive(true);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Set this timestamp as active and cleanup previous state
    GlobalAudioController.cleanup();
    GlobalAudioController.activeTimestamp = timestampId;

    resetStates();
    await cleanupCurrentAudio();

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (e) => {
        if (GlobalAudioController.activeTimestamp !== timestampId) return;

        try {
          const audioBuffer = await audioContext.decodeAudioData(e.target.result);
          const duration = Math.min(180, audioBuffer.duration);
          const trimmedBuffer = audioContext.createBuffer(
            audioBuffer.numberOfChannels,
            Math.floor(duration * audioBuffer.sampleRate),
            audioBuffer.sampleRate
          );

          for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            trimmedBuffer.copyToChannel(
              audioBuffer.getChannelData(channel).slice(0, Math.floor(duration * audioBuffer.sampleRate)),
              channel
            );
          }

          const wavBlob = await audioBufferToWAV(trimmedBuffer);
          const formData = new FormData();
          const filename = `${date}-${time.replace(':', '-')}.m4a`;
          formData.append('audio', wavBlob, filename);

          const uploadResponse = await fetch('http://localhost:8001/save-audio', {
            method: 'POST',
            body: formData
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload file');
          }

          if (GlobalAudioController.activeTimestamp === timestampId) {
            setShowUploadPrompt(false);
            await playSound(`http://localhost:8001/new-sounds/${filename}`);
          }

        } catch (error) {
          if (GlobalAudioController.activeTimestamp === timestampId) {
            console.error('Error processing file:', error);
            alert('Error processing audio file. Please try again.');
            resetStates();
          }
        }
      };

      reader.readAsArrayBuffer(file);

    } catch (error) {
      if (GlobalAudioController.activeTimestamp === timestampId) {
        console.error('Error handling file upload:', error);
        alert('Error handling file upload. Please try again.');
        resetStates();
      }
    }
  };


  

  useEffect(() => {
    return () => {
      if (GlobalAudioController.activeTimestamp === timestampId) {
        GlobalAudioController.cleanup();
      }
    };
  }, [timestampId]);

  return (
    <div className="timestamp-container">
      <div
        onClick={checkAndPlaySound}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: isActive ? '#ddd' : isHovered ? '#ddd' : '#f0f0f0',
          border: 'none',
          padding: '10px',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          color: 'black',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {time}
      </div>

      {isPlaying && !suppressProgressBar && (
        <div
          ref={progressBarRef}
          onClick={(e) => {
            if (audioRef.current && audioRef.current.duration) {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              const newTime = ratio * audioRef.current.duration;
              if (isFinite(newTime)) {
                audioRef.current.currentTime = newTime;
              }
            }
          }}
          style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#ddd',
            marginTop: '3px',
            cursor: 'e-resize',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              transition: 'width 0.1s linear',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        </div>
      )}

      {showUploadPrompt && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(220, 220, 220)',
            width: '300px',
            height: '306px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            cursor: 'move',
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <span
              onClick={() => {
                resetStates();
                GlobalAudioController.cleanup();
              }}
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
            <h3 style={{ color: 'black', marginBottom: '20px' }}>
              Upload new recording for {time}
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: '#f0f0f0', 
                border: 'none',
                padding: '10px',
                fontSize: '18px',
                cursor: 'pointer',
                width: '120px',
                marginTop: '20px',
                color: 'black',
              }}
            >
              Select File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundTimestamp;