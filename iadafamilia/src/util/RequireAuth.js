import { Navigate } from 'react-router-dom';

function RequireAuth({ children, redirectTo }) {
  const isAuthenticated = getAuth();

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export function getAuth() {
  const token = sessionStorage.getItem('authToken');
  return token !== null;
}

export default RequireAuth;
