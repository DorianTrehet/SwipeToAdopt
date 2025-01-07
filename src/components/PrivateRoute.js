// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token'); // Vérification du jeton

  return isAuthenticated ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" /> // Rediriger si non authentifié
  );
};

export default PrivateRoute;