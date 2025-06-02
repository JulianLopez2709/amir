import apiFetch from "../client"

export const login = async (identifier:string, password:string)=> {
    const response = await apiFetch(`auth/login`, {
        method: 'POST',
        body: JSON.stringify({identifier, password}),
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}