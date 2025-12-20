import Product from "@/@types/Product"
import apiFetch from "../client"
import { CreateProductPayload } from "@/@types/order/api/CreateProduct"


export const getAllProductByCompany = async (companyId: number) => {
    const response = await apiFetch<Product[]>(`product/${companyId}`)
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}

export const createProduct = async ( product: CreateProductPayload) => {
    const response = await apiFetch<any>(`product/`, {
        method: 'POST',
        body: JSON.stringify(product),
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}