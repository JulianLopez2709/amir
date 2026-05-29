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

        const apiCompany =
            response?.company ??
            response?.activeCompany ??
            (typeof response === "object" && response !== null && "id" in response ? response : null);

        setCompany({
            ...company,
            ...(apiCompany && typeof apiCompany === "object" ? apiCompany : {}),
        });

        return response;
    };

    return { changedCompany };
};