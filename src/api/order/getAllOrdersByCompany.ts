import { OrdenReques } from "@/@types/Order"
import apiFetch from "../client"

export const getAllOrdersByCompany = async (companyId:number) => {
    const response = await apiFetch<OrdenReques[]>(`order/${companyId}`)
    if (!response) {
        throw new Error('No response from server')
    }
  
    return response
}