import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#4c1d95',
            color: '#ede9fe',
            borderRadius: '12px',
            padding: '12px 20px',
          },
          success: { duration: 3000 },
          error: { duration: 4000 },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
