import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import PublicLayout from "./templates/PublicLayout"
import AdminLayout from "./templates/AdminLayout"
import LandingPage from "./pages/landing/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import ProductsPage from "./pages/admin/products/ProductsPage"
import OrderPage from "./pages/admin/orders/OrderPage"
import DashboardPage from "./pages/admin/dashboard/DashboardPage"
import SettingPage from "./pages/admin/settings/SettingPage"
import CreateCompany from "./pages/admin/company/CreateCompany"
import ProtectRoute from "./components/ProtectRoute"
import './App.css'
import User from './@types/User'
import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'

function App() {

  const [user, setUser] = useState<User | null>(null)
  const [rol, setRol] = useState<string | null>("asesor")
  useEffect(() => {
    /*const getToken = Cookies.get("token")
    if (getToken) {
      const decoded : DecodedToken = jwtDecode(getToken)
      console.log(decoded)
      setRol(decoded.rol)
    }*/
    const dataUserLocal = localStorage.getItem("user")
    if (dataUserLocal) {
      const userLocal = JSON.parse(dataUserLocal)
      setUser(userLocal)
      setRol(userLocal.rol)
    }
  }, [])

  return (
    <AuthProvider>

      <BrowserRouter>
        <Routes>

          {/* Rutas públicas */}
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* Página de login */}
          <Route path="/auth" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route element={<AdminLayout />} >
            <Route element={<ProtectRoute isAllow={!!user} />}>
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/orders" element={<OrderPage />} />
            </Route>
            <Route element={<ProtectRoute isAllow={!!user && rol == "admin"} redirectTo="/admin/products" />} >
              <Route path="/admin" index element={<DashboardPage />} />
              <Route path="/admin/setting" element={<SettingPage />} />
            </Route>
          </Route>

          <Route element={<ProtectRoute isAllow={!!user} />}>
            <Route path="/createCompany" element={<CreateCompany />} />
          </Route>


          {/* Redirección si no encuentra la ruta */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App

