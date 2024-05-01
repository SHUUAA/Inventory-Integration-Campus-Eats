import { createContext, useContext } from 'react';
import DataFetch from '../components/data/Fetch';

const UserContext = createContext(null); // Default value

export const UserProvider = ({ children }) => {
    const userType = DataFetch();
    return (
        <UserContext.Provider value={{ userType }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}