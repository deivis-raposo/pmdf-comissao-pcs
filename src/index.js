import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports'; // gerado automaticamente pelo amplify
Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Medição de performance opcional
reportWebVitals();




