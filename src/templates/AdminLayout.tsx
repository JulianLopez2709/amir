import { Button } from "@/components/ui/button"
import { House, LogOut, ScrollText, Settings } from "lucide-react"
import { Link, Outlet } from "react-router-dom"



function AdminLayout() {
    return (
        <>
            <header className="border-b-2 border-gray-100 p-5 flex justify-between items-center">
                <div className="flex gap-5">
                    <div className="w-10 h-5">LOGO</div>
                    <p>name section</p>
                </div>
                <div>perfil avatar</div>
            </header>
            <div className="h-screen flex">
                <nav className="h-full flex-col justify-between border-r-2 border-gray-100 ">
                    <div className="p-2  flex flex-col ">
                        
                        <Button  className="bg-[#2CEE12] size-[60px] rounded-2xl opacity-50">
                            <Link to="/admin" className="flex items-center gap-2 py-7">
                                <House />
                            </Link>
                        </Button>
                        <Button  className="bg-[#12EE96] size-[60px] rounded-2xl opacity-50">
                            <Link to="/admin/products" className="flex items-center gap-2 py-7">
                                <p className="font-bold h-full w-full">P</p>
                            </Link>
                        </Button>
                        <Button  className="bg-[#123EEE] size-[60px] rounded-2xl opacity-50">
                            <Link to="/admin/orders" className="flex items-center gap-2 py-7">
                                <ScrollText />
                            </Link>
                        </Button>
                        <Button className="bg-[#B012EE] size-[60px] rounded-2xl opacity-50">
                            <Link to="/admin/settings" className="flex items-center gap-2 py-7">
                                <Settings />
                            </Link>
                        </Button>

                    </div>
                    <Button className="bg-green-700 hover:bg-green-800 text-white rounded-none">
                        <Link to="/" className="flex items-center gap-2 py-7">
                            <LogOut />
                            <span>Salir</span>
                        </Link>
                    </Button>
                </nav>
                <main className="bg-[#EFEFEF] h-full w-full"><Outlet /></main>
            </div>
        </>
    )
}

export default AdminLayout