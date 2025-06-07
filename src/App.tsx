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
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'

// Componente separado para las rutas que necesitan acceso al contexto
function AppRoutes() {
  const { user, rol } = useAuth();

  return (
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
        <Route element={<ProtectRoute isAllow={!!user && rol === "admin"} redirectTo="/admin/products" />} >
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
  );
}

// Componente principal que provee el contexto
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App

