import { createContext, useContext } from 'react';
import DataFetch from '../components/data/Fetch';

const UserContext = createContext(null); // Default value

export const UserProvider = ({ children }) => {
    const userType = DataFetch();
    // Your existing DataFetch logic with userType state and updates
    return (
        <UserContext.Provider value={{ userType }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}