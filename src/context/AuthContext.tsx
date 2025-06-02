import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Company = {
    id: number;
    name: string;
    primary_color: string;
    secondary_color: string;
    type?: string;
};

type User = {
    rol: string;
    companies: Company[];
};

type AuthContextType = {
    user: User | null;
    rol: string | null;
    setUser: (user: User | null) => void;
    company: Company | null;
    setCompany: (company: Company) => void;
    primaryColor: string;
    secondaryColor: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [rol, setRol] = useState<string | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [primaryColor, setPrimaryColor] = useState("#309b5c");
    const [secondaryColor, setSecondaryColor] = useState("#309b5c");

    useEffect(() => {
        const dataUserLocal = localStorage.getItem("user");
        if (dataUserLocal) {
            const userLocal = JSON.parse(dataUserLocal);
            setUser(userLocal);
            setRol(userLocal.rol);
            const firstCompany = userLocal.companies[0];
            setCompany(firstCompany);
            setPrimaryColor(firstCompany.primary_color || "#309b5c");
            setSecondaryColor(firstCompany.secondary_color || "#309b5c");
        }
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty("--primary-color", primaryColor);
        document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    }, [primaryColor, secondaryColor]);

    const handleSetCompany = (newCompany: Company) => {
        setCompany(newCompany);
        setPrimaryColor(newCompany.primary_color || "#309b5c");
        setSecondaryColor(newCompany.secondary_color || "#309b5c");
    };

    return (
        <AuthContext.Provider value={{ user, rol, setUser, company, setCompany: handleSetCompany, primaryColor, secondaryColor }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
