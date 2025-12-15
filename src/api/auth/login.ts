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


export const changeCompany = async (companyId:number): Promise<any>=> {
    console.log("ID: ",companyId)
    const response = await apiFetch<any>(`auth/select_company`, {
        method: 'POST',
        body: JSON.stringify({companyId}),
    })
    console.log("responde by api: ",response)
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}