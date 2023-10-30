import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const UserRoute = ({ children }) => {
    const loggedIn = useAuthStore((state) => state.isLoggedIn)();
    return loggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export default UserRoute;
