import Product from "./Product";

type Status = "new" | "proceso" | "terminado"  | "cancelado"

export interface OrdenReques{
    cliente_create : string,
    order : number,
    status : string,
    list_products : Product_Orden[],
    metodo_pago : string,
    total_price : number
}

export interface Product_Orden{
    product : Product,
    status : Status,
    notes : string,
    quantity : number
}

interface Orden{
    id:number,
    total_price:number,
    status : Status
    
}

export default Orden;