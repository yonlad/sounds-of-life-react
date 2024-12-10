// firebase/services.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './init';

// Make sure this exactly matches your Render URL
const API_URL = 'https://sounds-of-life-server.onrender.com/api';

export const textServices = {
  getText: async (number) => {
      if (!number) return '';
      
      try {
          const response = await fetch(`${API_URL}/texts/${number}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          return {
              text: data.text || '',
              exists: data.exists
          };
      } catch (error) {
          console.error('Error getting text:', error);
          return { text: '', exists: false };
      }
  },

  saveText: async (number, text) => {
      if (!number) return false;
      
      try {
          const response = await fetch(`${API_URL}/texts/${number}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ text: text || '' })
          });

          return response.ok;
      } catch (error) {
          console.error('Error saving text:', error);
          return false;
      }
  }
};



// Keep the existing audioServices unchanged since it works well
export const audioServices = {
    upload: async (audioBlob, fileName) => {
        try {
            const storageRef = ref(storage, `new-sounds/${fileName}`);
            await uploadBytes(storageRef, audioBlob);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error uploading audio:', error);
            throw error;
        }
    },

    getUrl: async (fileName) => {
        try {
            const audioRef = ref(storage, `new-sounds/${fileName}`);
            return await getDownloadURL(audioRef);
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                // Return null instead of throwing for missing files
                return null;
            }
            console.error('Error getting audio URL:', error);
            throw error;
        }
    }
};