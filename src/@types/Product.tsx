type TypeProduct = "Combo" | "Producto" | "Servicio"

interface Product {
    id : number,
    type : TypeProduct,
    name : string,
    description : string,
    price_selling : number,
    price_cost : number,
    stock : number,
    
    imgUrl :string,
    barcode : number,

}

export default Product