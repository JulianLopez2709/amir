import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../templates/PublicLayout";
import AdminLayout from "../templates/AdminLayout";
import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import ProductsPage from "../pages/admin/products/ProductsPage";
import OrderPage from "@/pages/admin/orders/OrderPage";
import DashboardPage from "@/pages/admin/dashboard/DashboardPage";


const router = createBrowserRouter([
    {
        path : "/",
        element : <PublicLayout />,
        children : [
            {index:true,element:<LandingPage/>}
        ]
    },
    {
        path : "/auth",
        element : <LoginPage/>
    },
    {
        path : "/admin",
        element : <AdminLayout />,
        children : [
            {
                index:true,element:<DashboardPage/>
            },
            {
                path : "products",
                element : <ProductsPage/>
            },
            {
                path : "orders",
                element : <OrderPage/>
            }
        ]   
    },
    
])

export default router;