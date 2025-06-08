import Product from "./Product";

type Status = "new" | "proceso" | "terminado"  | "cancelado"

export interface OrdenReques{
    cliente_create : string,
    id : number,
    status : string,
    products ?: Product_Orden[],
    //metodo_pago : string,
    total_price : number
    createAt : string,
}

export interface Product_Orden{
    product ?: Product,
    status : Status,
    notes : string,
    quantity : number
    productId ?: number
}

interface Orden{
    id:number,
    total_price:number,
    status : Status
    
}

export interface createOrderBody{
    total_price: number,
    companyId: number,
    products: Product_Orden[]
}

export interface newProductToOrder {
    product: Product,
    acount: number
}

export default Orden;