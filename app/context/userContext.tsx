"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

type UserContextType = {
    id: string;
    name: string | null;
    email: string | null;
    soundEnabled: boolean;

    setSoundEnabled: (enabled: boolean) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
    children,
    user,
}: {
    children: ReactNode;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        soundEnabled: boolean;
    };
}) {
    const [soundEnabled, setSoundEnabled] = useState(
        user.soundEnabled
    );

    return (
        <UserContext.Provider
            value={{
                id: user.id,
                name: user.name,
                email: user.email,
                soundEnabled,
                setSoundEnabled,
            }
            }
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser must be used inside UserProvider"
        );
    }

    return context;
}