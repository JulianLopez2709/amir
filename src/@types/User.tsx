export type TypeUser = "admin" | "asesor"

interface User {
    id: number,
    name: string,
    email: string,
    username: string,
    address: string,
    telefon: string
    rol : TypeUser
}


export const listUsers: User[] = [
    {
        id: 1452,
        name: "Julian David Lopez",
        email: "jdlopez@gmail.com",
        username: "jdlopez",
        address: "CL 5 # 15 20",
        telefon: "31478596",
        rol : "admin"
    }
]

export default User; 