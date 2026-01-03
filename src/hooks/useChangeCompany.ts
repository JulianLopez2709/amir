import { useAuth } from "@/context/AuthContext";
import { changeCompany } from "@/api/auth/login";

export const useChangeCompany = () => {
    const { setCompany, companies } = useAuth();

    const changedCompany = async (companyId: number) => {
        const response = await changeCompany(companyId);

        const company = companies.find(c => c.id === companyId);

        if (!company) {
            throw new Error("Company not found in context");
        }

        // 🔥 ACTUALIZA EL ESTADO GLOBAL
        setCompany(company);

        return response;
    };

    return { changedCompany };
};