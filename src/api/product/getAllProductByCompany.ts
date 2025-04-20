import Product from "@/@types/Product"
import apiFetch from "../client"


export const getAllProductByCompany = async (companyId: number) => {
    const response = await apiFetch<Product[]>(`product/${companyId}`)
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}

export const createProduct = async ( product: Product) => {
    const response = await apiFetch<Product>(`product/`, {
        method: 'POST',
        body: JSON.stringify(product),
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}