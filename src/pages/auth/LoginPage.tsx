import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import inventariadoImg from '../../assets/inventariadoImg.webp'
import { useState } from "react"
import { login } from "@/api/auth/login"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Iniciando sesión con:", email, password)
    if (!email || !password) {
      return
    }

    try {
      const responde = await login(email, password)
      if (responde) {
        console.log("Inicio de sesión exitoso:", responde)
        localStorage.setItem("token", responde.token)
        localStorage.setItem("user", JSON.stringify(responde))
        navigate("/admin/products")
      } else {
        alert("Error al iniciar sesión. Por favor, verifica tus credenciales.")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Por favor, verifica tus credenciales.");
      setEmail("");
      setPassword("");
    }

  }

  return (
    <div className="h-screen md:flex">
      <div className="w-96 h-full m-auto flex flex-col items-center justify-center">
        <h2 className="font-extrabold py-5 text-8xl text-green-700 ">Amin</h2>
        <h1 className="font-bold text-3xl">Ingresa a tu cuenta</h1>
        <h2 className="pb-10 text-xl">Gana tiempo y administra tu empresa.</h2>
        <div className="w-full py-3">
          <label htmlFor="email">Nombre de usuario o correo electronico</label>
          <Input className="py-5 text-xl" type="text" id="email" placeholder="Ingrese email o username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="w-full py-3">
          <div className="flex justify-between">
            <label htmlFor="password">Password</label>
            <p className="text-sm text-green-700 opacity-70">¿Olvidaste tu contraseña?</p>
          </div>
          <Input className="py-5" type="password" id="password" placeholder="Ingrese Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="bg-green-700 w-full p-5" onClick={handleLogin}>Ingresar</Button>
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
            Organiza, gestiona y crece con AMIN.
          </p>
        </div>

        <footer className="relative z-10 p-4 text-green-700">© 2025 AMIN</footer>
      </div>

    </div>
  )
}

export default LoginPage