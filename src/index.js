import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';  // Importing Provider
import { PersistGate } from 'redux-persist/integration/react';  // Importing PersistGate for redux-persist
import './styles/tailwind.css';  // Update path as needed
import '@fortawesome/fontawesome-free/css/all.min.css';  // FontAwesome styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './layouts/Admin';  // Your Admin Layout
import Login from 'components/auth/Login';  // Your Login Component
import { store, persistor } from './redux/Store.js';  // Import your store and persistor


// Create root first
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your app with the Redux Provider */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>  {/* Wrapping with PersistGate */}
        <BrowserRouter>
          <Routes>
         
            <Route path="/login" element={<Login />} />
       
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
