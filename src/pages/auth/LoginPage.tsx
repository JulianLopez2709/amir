import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import inventariadoImg from '../../assets/inventariadoImg.webp'

function LoginPage() {
  return (
    <div className="h-screen md:flex">
      <div className="w-96 h-full m-auto flex flex-col items-center justify-center">
        <h2 className="font-extrabold py-5 text-8xl text-green-700 ">Amir</h2>
        <h1 className="font-bold text-3xl">Ingresa a tu cuenta</h1>
        <h2 className="pb-10 text-xl">Gana tiempo y administra tu empresa.</h2>
        <div className="w-full py-3">
          <label htmlFor="email">Nombre de usuario o correo electronico</label>
          <Input className="py-5 text-xl" type="email" id="email" placeholder="Ingrese Username" />
        </div>
        <div className="w-full py-3">
          <div className="flex justify-between">
            <label htmlFor="password">Password</label>
            <p className="text-sm text-green-700 opacity-70">¿Olvidaste tu contraseña?</p>
          </div>
          <Input className="py-5" type="password" id="password" placeholder="Ingrese Password" />
        </div>
        <Button className="bg-green-700 w-full p-5"><Link to="/admin/products">Ingresar</Link></Button>
        <p className="text-sm opacity-70">Ingresa como asesor o administrador</p>
        <Link to="/">
          <p className="opacity-70 text-green-700">¿Necesitas ayuda?</p>
        </Link>
      </div>
      <div className="h-full md:w-[50%] flex flex-col justify-between items-center rounded-tl-4xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-80% from-black to-transparent ">
          <img
            src={inventariadoImg}
            alt="Fondo"
            className="w-full h-full object-cover opacity-70 "
          />
        </div>  

        <div className="relative z-10 p-10  h-full flex flex-col justify-end items-center">
          <h2 className="text-6xl xl:text-8xl font-bold text-white">
            Un solo sitio web para <span className="text-green-400 ">controlar</span> tu empresa.
          </h2>
          <p className="mt-4 text-lg text-white w-full text-end opacity-80">
            Organiza, gestiona y crece con AMIR.
          </p>
        </div>

        <footer className="relative z-10 p-4 text-green-700">© 2025 AMIR</footer>
      </div>

    </div>
  )
}

export default LoginPage