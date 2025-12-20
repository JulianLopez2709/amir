import apiFetch from "../client"


export const addedStock = async (
    productId: string,
    quantityChange: number
) => {
    console.log("data for update stock: ",productId,quantityChange)
    const body = { productId, quantityChange }
    const response = await apiFetch<any>(`stock/adjust/`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

    if (!response) {
        throw new Error('No response from server');
    }

    return response;
};
