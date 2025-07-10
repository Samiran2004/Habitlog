import { createContext, useContext, useEffect, useState } from "react";
import { ID } from 'react-native-appwrite';
import { account } from "./appwrite";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    // Define signUp and signIn here (replace with your actual logic)
    // console.log(user);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            console.log("Error in getUser: ", error.message);
            setUser(null);
            return;
        } finally {
            setIsLoadingUser(false);
        }
    }
    const signUp = async (email, password) => {
        try {
            await account.create(
                ID.unique(),
                email,
                password
            );
            await signIn(email, password);
            await getUser();
        } catch (error) {
            console.log("Error in signUp: ", error.message);
            return "An error ocur during signUp.";
        }
    };
    const signIn = async (email, password) => {
        try {
            // Ensure any existing session is removed
            await account.deleteSession("current");
        } catch (err) {
            // It's OK if there's no current session
            console.log("No existing session to delete or error:", err.message);
        }

        try {
            // Now create a fresh session
            await account.createEmailPasswordSession(email, password);
            await getUser(); // Refresh user context
            return null;
        } catch (error) {
            console.log("Error in signIn: ", error.message);
            return "An error occurred during signIn.";
        }
    };


    const signOut = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.log("Error in signOut: ", error.message);
            return "An error occur during signOut.";
        }
    }

    return <AuthContext.Provider value={{ user, signUp, signIn, signOut, isLoadingUser }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be inside of the AuthProvider.");
    }

    return context;
}