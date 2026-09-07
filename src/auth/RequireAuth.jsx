import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Dashboard actions (adding a crop, syncing location) assume a signed-in
// user and throw on a null uid otherwise - this guard keeps a signed-out or
// session-expired visitor from ever reaching that crash by bouncing them to
// the login page first.
export default function RequireAuth({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
