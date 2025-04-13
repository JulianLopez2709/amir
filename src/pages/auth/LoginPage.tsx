import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function LoginPage() {
  return (
    <div className="h-screen">
      <div className="w-96 h-full m-auto flex flex-col items-center justify-center">
        <h1>AMIR</h1>
        <h2>Ingresa a tu cuenta</h2>
        <p>Gana tiempo</p>
        <Button className="bg-green-700 w-full p-5"><Link to="/admin/products">Ingresar</Link></Button>
      </div>
    </div>
  )
}

export default LoginPage