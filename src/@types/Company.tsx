type TypeCompany = "Restaurante" | "Heladeria" | "Licorera" | "Ferreteria" | "Ropa y calzado" | "Tienda" 

interface Company{
    id : number,
    type : TypeCompany,
    name: string,
    slogan: string,
    logo : string,
    primary_color : string,
    secondary_color : string,
    plan : string,
}

export default Company
