// src/components/HeaderPopup.js
import React from 'react';

const headerInfo = `<h1 style="text-align: center"><em>welcome to the calendar of hope</em></h1><br><p>reimagining the calendar of remembrance, the calendar of hope invites you to dream the future. a future where people can return to their homes, where guns and bombs are replaced by brushes and classrooms, where young men live to see their grandchildren born, where one is able to dream.</p><br><p>this (web)site offers the opportunity to begin the project of building this future. here, we can write the future we want to read. here, we can record the sounds we want to hear. it is ours to create. click around and explore the sounds and words envisioned in this future. feel free to add and/or change the current words and sounds. the assumption of this space is that building the future is a constant, collective effort. only together can we dream a future that includes and benefits the many and not just the few.</p><br><p>since we are not yet living in this future, it is necessary to stress that no forms of discrimination or harassment will be tolerated in this space. here, we are invested in imagining an emancipatory, safe space for all. by contributing your words and/or sounds you are agreeing to participate in a community dedicated for mutual empowerment and uplifting.</p><br><h2 style="text-align: center; text-indent: 0">W E L C O M E</h2>`;

const HeaderPopup = ({ onClose, style }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(90vw, 800px)',
        height: 'min(90vh, 800px)',
        aspectRatio: '1 / 1',
        backgroundColor: 'rgb(0, 0, 0)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        overflow: 'auto',
        cursor: 'vertical-text',
      
        
        ...style
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '20px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          color: 'white',
          cursor: 'crosshair',
          padding: '10px',
        }}
      >
        ×
      </button>
      <div 
        style={{ 
          textIndent: 'clamp(20px, 8%, 60px)',
          fontSize: 'clamp(18px, 4vw, 30px)',
          fontFamily: 'Times, serif',
          textAlign: 'left',
          padding: '20px',
          cursor: 'vertical-text',
          color: 'white',
          marginTop: '40px',
        }}
        dangerouslySetInnerHTML={{ __html: headerInfo }}
      />
    </div>
  );
};

export default HeaderPopup;