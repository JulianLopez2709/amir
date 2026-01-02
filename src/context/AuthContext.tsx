import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Company = {
    id: number;
    role: string;
    name: string;
    slogan: string;
    logo: string;
    type: string;
    primary_color: string;
    secondary_color: string;
};

type User = {
    id: number;
    email: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    rol: string | null;
    setUser: (user: User | null) => void;
    company: Company | null;
    setCompany: (company: Company) => void;
    primaryColor: string;
    secondaryColor: string;
    companies: Company[];
    setCompanies: (companies: Company[]) => void;
    activeCompanyId: number | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [rol, setRol] = useState<string | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [primaryColor, setPrimaryColor] = useState("#309b5c");
    const [secondaryColor, setSecondaryColor] = useState("#309b5c");

    useEffect(() => {
        try {
            const dataUserLocal = localStorage.getItem("user");
            const companiesLocal = localStorage.getItem("companies");
            const activeCompanyLocal = localStorage.getItem("activeCompany");

            if (dataUserLocal && companiesLocal) {
                const userLocal = JSON.parse(dataUserLocal);
                const companiesData = JSON.parse(companiesLocal);

                setUser(userLocal);
                setCompanies(companiesData);

                if (activeCompanyLocal) {
                    const companyParsed = JSON.parse(activeCompanyLocal);
                    setCompany(companyParsed);
                    setRol(companyParsed.role);
                    setPrimaryColor(companyParsed.primary_color || "#309b5c");
                    setSecondaryColor(companyParsed.secondary_color || "#309b5c");
                } else {
                    const firstAvailable = companiesData.find(c => c.available);
                    if (firstAvailable) {
                        handleSetCompany(firstAvailable);
                    }
                }
            }
        } catch (error) {
            localStorage.clear();
        }
    }, []);


    useEffect(() => {
        document.documentElement.style.setProperty("--primary-color", primaryColor);
        document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    }, [primaryColor, secondaryColor]);

    const handleSetCompany = (newCompany: Company) => {
        if (!newCompany) return;

        setCompany(newCompany);
        setRol(newCompany.role);

        setPrimaryColor(newCompany.primary_color || "#309b5c");
        setSecondaryColor(newCompany.secondary_color || "#309b5c");

        localStorage.setItem("activeCompany", JSON.stringify(newCompany));
    };


    return (
        <AuthContext.Provider value={{
            user,
            rol,
            setUser,
            company,
            setCompany: handleSetCompany,
            primaryColor,
            secondaryColor,
            companies,
            setCompanies,
            activeCompanyId: company?.id ?? null
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
