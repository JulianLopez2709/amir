import { Button } from "@/components/ui/button"
import { House, LogOut, ScrollText, Settings } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function AdminLayout() {
    const location = useLocation()

    const getSectionTitle = () => {
        switch(location.pathname) {
            case '/admin':
                return 'Inicio'
            case '/admin/products':
                return 'Productos'
            case '/admin/orders':
                return 'Pedidos'
            case '/admin/settings':
                return 'Configuración'
            default:
                return 'Section'
        }
    }

    const isActive = (path: string) => {
        return location.pathname === path
    }


    return (
        <div className="h-screen flex flex-col">
            <header className="border-b-2 border-gray-100 p-2 md:p-5 flex justify-between items-center">
                <div className="flex text-2xl gap-5 ">
                    <div className="w-10 h-5 text-green-700 font-bold mr-2">AMIR</div>
                    <p className="font-bold">{getSectionTitle()}</p>
                </div>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <nav className="flex flex-col justify-between border-r-2 border-gray-100 ">
                    <div className="p-1 md:p-2 flex flex-col gap-y-3">
                    <Link to="/admin" className="size-[60px]">
                            <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin') ? 'bg-[#2CEE12] opacity-100' : 'bg-[#2CEE12] opacity-50'}`}>
                                <House />
                            </Button>
                        </Link>
                        <Link to="/admin/products" className="size-[60px]">
                            <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin/products') ? 'bg-[#12EE96] opacity-100' : 'bg-[#12EE96] opacity-50'}`}>
                                <p className="font-bold m-auto">P</p>
                            </Button>
                        </Link>
                        <Link to="/admin/orders" className="size-[60px]">
                            <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin/orders') ? 'bg-[#123EEE] opacity-100' : 'bg-[#123EEE] opacity-50'}`}>
                                <ScrollText />
                            </Button>
                        </Link>
                        <Link to="/admin/setting" className="size-[60px]">
                            <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin/settings') ? 'bg-purple-700 opacity-100' : 'bg-[#B012EE] opacity-50'}`}>
                                <Settings />
                            </Button>
                        </Link>
                    </div>
                    <Link to="/" className="w-full">
                        <Button className=" cursor-pointer w-full h-full items-center bg-green-700 hover:bg-green-800 text-white rounded-none py-7">
                            <LogOut />
                            <span>Salir</span>
                        </Button>
                    </Link>
                </nav>
                <main className="bg-[#EFEFEF] flex-1  w-full"><Outlet /></main>
            </div>
        </div>
    )
}

export default AdminLayout