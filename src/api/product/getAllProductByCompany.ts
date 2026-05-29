import Product from "@/@types/Product"
import apiFetch from "../client"


export const getAllProductByCompany = async (companyId: number) => {
    const response = await apiFetch<Product[]>(`product/${companyId}`)
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}

export const createProduct = async ( formData: FormData) => {
    const response = await apiFetch<any>(`product/`, {
        method: 'POST',
        body: formData,
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}

export const updateProduct = async (productId: string, formData: FormData) => {
    const response = await apiFetch<any>(`product/${productId}`, {
        method: 'PATCH',
        body: formData,
    })
    if (!response) {
        throw new Error('No response from server')
    }

    return response
}
