import { Navigate } from 'react-router-dom';
import { authentication} from '../config/firebase';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authentication.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div>Protected Route</div>;
};

export default ProtectedRoute;