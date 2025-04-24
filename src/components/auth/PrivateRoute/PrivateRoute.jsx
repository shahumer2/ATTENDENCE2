// components/PrivateRoute.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../../../redux/Slice/SignInSlice'; // Adjust the import path as needed

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // This will run when the route changes
    // You can add additional checks here if needed
  }, [location]);

  if (!currentUser) {
    // Dispatch signout success to clear any partial state
    dispatch(signoutSuccess());
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;