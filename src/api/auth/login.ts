import apiFetch from "../client"

export const login = async (email, password)=> {
    const response = await apiFetch(`auth/login`, {
        method: 'POST',
        body: JSON.stringify({email, password}),
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}