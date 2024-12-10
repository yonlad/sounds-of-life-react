// scripts/replace-env.js
const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '..', 'build');
const envJsPath = path.join(buildPath, 'env.js');

const envVars = {
  REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

let envJs = fs.readFileSync(envJsPath, 'utf8');

Object.keys(envVars).forEach(key => {
  envJs = envJs.replace(`%%${key}%%`, envVars[key] || '');
});

fs.writeFileSync(envJsPath, envJs);