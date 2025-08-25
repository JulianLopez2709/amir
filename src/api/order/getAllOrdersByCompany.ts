import { createOrderBody, OrdenReques } from "@/@types/Order"
import apiFetch from "../client"

export const getAllOrdersByCompany = async (companyId:number) => {
    const response = await apiFetch<OrdenReques[]>(`order/${companyId}`)
    if (!response) {
        throw new Error('No response from server')
    }
  
    return response
}



export const createOrderByCompany = async (dataBody : createOrderBody) => {
   
    const response = await apiFetch<createOrderBody>(`order/`, {
        method: 'POST',
        body: JSON.stringify(dataBody),
    })
    if (!response) {
        throw new Error('No response from server')
    }
 
    return response
}


export const updateOrderStatus = async (
  orderId: number,
  status: 'completed' | 'canceled' | 'expense',
  paymentMethod?: 'cash' | 'card'
) => {
  const body = { status, paymentMethod };
  
  const response = await apiFetch<OrdenReques>(`order/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (!response) {
    throw new Error('No response from server');
  }

  return response;
};