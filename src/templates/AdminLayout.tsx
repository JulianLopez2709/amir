import { Button } from "@/components/ui/button"
import { ChevronsUpDown, DiamondPlus, House, LogOut, ScrollText, Settings } from "lucide-react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useAuth } from "@/context/AuthContext"
import Cookies from "js-cookie"
import { SocketProvider, useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { useEffect } from "react"
import Orden from '@/@types/Order';
import Product from '@/@types/Product';

function AdminLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { company, setCompany, primaryColor, secondaryColor, user, setUser, companies } = useAuth();

    const { socket } = useSocket();

    // ✨ ¡Aquí está la magia!
    // Este useEffect se encargará de las notificaciones globales
    useEffect(() => {
        if (!socket) return;

        // Listener para nuevas órdenes
        const handleNewOrder = (order: Orden) => {
            toast.success("Nueva Orden Creada", {
                description: `La orden #${order.id.toString().substring(0, 8)} ha sido creada.`,
                duration: 5000,
            });
        };

        // Listener para nuevos productos
        const handleNewProduct = (product: Product) => {
            toast.info("Nuevo Producto Disponible", {
                description: `El producto "${product.name}" ha sido agregado.`,
                duration: 5000,
            });
        };

        // Suscribimos a los eventos
        socket.on('newOrder', handleNewOrder);
        socket.on('newProduct', handleNewProduct);

        // Limpieza: Nos desuscribimos cuando el layout se desmonte (al cerrar sesión)
        return () => {
            socket.off('newOrder', handleNewOrder);
            socket.off('newProduct', handleNewProduct);
        };

    }, [socket]);


    const getSectionTitle = () => {
        switch (location.pathname) {
            case '/admin': return 'Inicio';
            case '/admin/products': return 'Productos';
            case '/admin/orders': return 'Pedidos';
            case '/admin/setting': return 'Configuración';
            default: return 'Sección';
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path
    }

    const otherCompanies = companies || [];

    const handleLogout = () => {
        // Clear auth state
        setUser(null);
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('companies');
        // Remove token cookie
        Cookies.remove('token');
        // Set company to an empty company object instead of null
        setCompany({
            id: 0,
            name: '',
            primary_color: '#309b5c',
            secondary_color: '#309b5c',
            role: '',
            slogan: '',
            logo: '',
            type: '',
        });
        // Navigate to home and replace the history entry
        navigate('/', { replace: true });
    };

    return (

        <SocketProvider>

            <div className="h-screen flex flex-col">
                <header className=" border-gray-100 p-1 md:px-5 md:py-3 flex justify-between items-center">
                    <Popover >
                        <PopoverTrigger className="min-w-74">
                            <div className="flex text-2xl gap-5 w-full justify-between items-center cursor-pointer hover:bg-gray-100 hover:rounded-sm transition-all duration-300 p-1">
                                <div className={`w-10 h-10 rounded-xl`}
                                    style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, }}>
                                </div>

                                <div className="flex flex-col mr-2 text-start flex-1">
                                    <h2 className="font-bold text-xl">{company?.name || "Nombre de la compañía"}</h2>
                                    <p className="text-sm">{getSectionTitle()}</p>
                                </div>
                                <ChevronsUpDown className="opacity-70" />
                            </div>
                        </PopoverTrigger >

                        <PopoverContent>
                            <div>
                                {otherCompanies.map((companies) => (
                                    <div
                                        key={companies.id}
                                        className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                                        onClick={() => {
                                            setCompany(companies);
                                        }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl`}
                                            style={{ background: `linear-gradient(to right, ${companies.primary_color}, ${companies.secondary_color})`, }}
                                        ></div>
                                        <div className="flex flex-col ml-3">
                                            <h2 className="font-bold text-base">{companies.name}</h2>
                                            <p className="text-sm">{companies.type}</p>
                                        </div>
                                        {company?.id === companies.id ? (
                                            <span className="ml-auto text-green-500">✓</span>
                                        ) : (
                                            null
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="border-2 rounded-sm p-2 flex justify-center items-center text-center cursor-pointer hover:bg-gray-100 transition-all duration-300">
                                <DiamondPlus className="mr-1 size-5 opacity-70" />
                                <p className="text-sm">Nueva Organizacion</p>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <nav className="flex flex-col justify-between border-r-2 border-gray-100 ">
                        <div className="p-1 md:p-2 flex flex-col gap-y-3">
                            <Link to="/admin" className="size-[60px]">
                                <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin') ? 'bg-[#2CEE12] opacity-100 border-2 border-gray-200' : 'bg-[#2CEE12] opacity-50'}`}>
                                    <House />
                                </Button>
                            </Link>
                            <Link to="/admin/products" className="size-[60px]">
                                <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin/products') ? 'bg-[#12EE96] opacity-100 border-2 border-gray-200' : 'bg-[#12EE96] opacity-50'}`}>
                                    <p className="font-bold m-auto">P</p>
                                </Button>
                            </Link>
                            <Link to="/admin/orders" className="size-[60px]">
                                <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin/orders') ? 'bg-[#123EEE] opacity-100 border-2 border-gray-200' : 'bg-[#123EEE] opacity-50'}`}>
                                    <ScrollText />
                                </Button>
                            </Link>
                            <Link to="/admin/setting" className="size-[60px]">
                                <Button className={`cursor-pointer w-full h-full rounded-2xl flex items-center justify-center ${isActive('/admin/setting') ? 'bg-purple-700 opacity-100 border-2 border-gray-200' : 'bg-[#B012EE] opacity-50'}`}>
                                    <Settings />
                                </Button>
                            </Link>
                        </div>
                        <div className="w-full">
                            <Button
                                onClick={handleLogout}
                                className="cursor-pointer w-full h-full items-center text-white rounded-none py-7 font-bold hover:opacity-80 transition-all duration-300"
                                style={{ background: 'var(--primary-color)' }}
                            >
                                <LogOut className="" />
                                <span>Salir</span>
                            </Button>
                        </div>
                    </nav>
                    <main className="bg-[#EFEFEF] flex-1  w-full"><Outlet /></main>
                </div>
            </div>
        </SocketProvider>
    )
}

export default AdminLayout