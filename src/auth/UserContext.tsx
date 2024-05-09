import { createContext, useContext } from 'react';
import DataFetch from '../components/data/Fetch';
import FirebaseController from '../firebase/FirebaseController';
const firebaseController = new FirebaseController();
const currentUser = firebaseController.getCurrentUser();

const UserContext = createContext(null); // Default value
const CurrentUserContext = createContext(null); // Default value

export const UserProvider = ({ children }) => {
    const {...userData} = DataFetch();
    return (
        <UserContext.Provider value={{ userData }}>
            {children}
        </UserContext.Provider>
    );
}

export const CurrentUserProvider = ({ children }) => {
    return (
        <UserContext.Provider value={currentUser}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}

export function useCurrentUserContext() {
    return useContext(CurrentUserContext);
}