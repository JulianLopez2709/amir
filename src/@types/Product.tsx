type TypeProduct = "combo" | "producto" | "servicio"

interface Product {
    id?: number,
    type?: TypeProduct,
    name: string,
    description?: string,
    price_selling: number,
    price_cost: number,
    stock?: number,
    imgUrl?: string,
    barcode ?: number,
    stock_minimo ?: number,
    avaliable ?: boolean,
    is_favorite ?: boolean,
    categoryId ?: number,
    companyId: number
    detail ?: {},
    //"createAt": "2025-04-19T01:43:38.083Z",

}



export default Product