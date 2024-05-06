// @ts-nocheck
import { createContext, useContext } from 'react';
import DataFetch from '../components/data/Fetch';

const UserContext = createContext(null); // Default value

export const UserProvider = ({ children }) => {
    const {...userData} = DataFetch();
    return (
        <UserContext.Provider value={{ userData }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}