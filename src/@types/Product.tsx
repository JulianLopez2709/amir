type TypeProduct = "combo" | "producto" | "servicio"

interface Product {
    id?: number,
    type?: TypeProduct,
    name: string,
    description?: string,
    price_selling: number,
    price_cost: number,
    stock_records?: Stock,
    imgUrl?: string,
    barcode ?: number,
    stock_minimo ?: number,
    avaliable ?: boolean,
    is_favorite ?: boolean,
    categoryId ?: number,
    companyId: number
    detail ?: {},
    variants ?: Variant[]
    //"createAt": "2025-04-19T01:43:38.083Z",

}

interface Stock {
    id: number,
    productId: string,
    quantity: number,
    type?: string,
    reference ?: string,
    createdAt : string,
}

interface Variant {
    id: number,
    name: string,
    productId: string,
    type?: string,
    reference ?: string,
    options : VariantOption[],
}

interface VariantOption {
    id: number,
    name: string,
    extraPrice: number,
    variantId: number,
}

export default Product