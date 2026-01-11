import { CreateOrderBody, OrdenReques, Order, ProductToOrder, UpdateBody } from "@/@types/Order"
import apiFetch from "../client"

export const getAllOrdersByCompany = async (
  companyId: number,
  params?: {
    startDate?: string
    endDate?: string
    status?: string
    page?: number
    limit?: number
  }
) => {
  const query = new URLSearchParams(params as any).toString()

  const response = await apiFetch<OrdenReques>(
    `order/company/${companyId}${query ? `?${query}` : ''}`
  )
  
  if (!response) {
    throw new Error('No response from server')
  }

  return response
}



export const createOrderByCompany = async (dataBody: CreateOrderBody) => {

  const response = await apiFetch<CreateOrderBody>(`order/`, {
    method: 'POST',
    body: JSON.stringify(dataBody),
  })
  if (!response) {
    throw new Error('No response from server')
  }

  return response
}


export const getOrderById = async (id: string) => {

  const response = await apiFetch<Order>(`order/${id}`, {
    method: 'GET',
  })
  if (!response) {
    throw new Error('No response from server')
  }

  return response
}


export const updateOrderStatus = async (
  orderId: string,
  status: 'completed' | 'canceled' | 'expense' | 'pending' | 'in_progress',
  //paymentMethod?: 'cash' | 'card'
) => {
  const body = { status /*, paymentMethod*/ };
  console.log(orderId, status)
  const response = await apiFetch<OrdenReques>(`order/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (!response) {
    throw new Error('No response from server');
  }

  return response;
};


export const updateOrder = async (
  orderId: string,
  body: UpdateBody,
  //paymentMethod?: 'cash' | 'card'
) => {
  const response = await apiFetch<OrdenReques>(`order/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!response) {
    throw new Error('No response from server');
  }

  return response;
};