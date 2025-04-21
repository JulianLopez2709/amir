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


const user: User = {
  id: 1,
  name: "Julián López",
  email: "julian@example.com",
  username: "julian_dev",
  rol: "admin", // o el enum que estés usando
}

function App() {

  return (
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
          <Route element={<ProtectRoute isAllow={!!user && user.rol == "admin"} redirectTo="/admin/products"/>} >
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
  )
}

export default App

