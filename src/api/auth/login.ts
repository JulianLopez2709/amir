import apiFetch from "../client"

interface Company {
    id: number;
    role: string;
    name: string;
    slogan: string;
    logo: string;
    type: string;
    primary_color: string;
    secondary_color: string;
}

interface LoginResponse {
    user: {
        id: number;
        email: string;
        name: string;
    };
    companies: Company[];
}

export const login = async (identifier:string, password:string): Promise<LoginResponse>=> {
    const response = await apiFetch<LoginResponse>(`auth/login`, {
        method: 'POST',
        body: JSON.stringify({identifier, password}),
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}