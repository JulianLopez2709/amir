import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router-dom"

function PublicLayout() {
    return (
        <div className="h-full">
            <header className="flex justify-between items-center max-w-7xl py-3 m-auto p-1">
                <div className="flex gap-3 items-center">
                    <h2 className="text-green-700 font-bold text-2xl mr-12">Amin</h2>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline"><Link to="/auth">Ingresa</Link></Button>
                    <Button className="bg-green-700 text-white" variant="default"><Link to="/auth">Empieza gratis</Link></Button>
                </div>
            </header>

            <main className=""><Outlet /></main>

            <footer className="max-w-7xl mx-auto py-6 border-t-2 border-gray-200">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Información de la empresa */}
                    <div className="text-center md:text-left">
                        <p className="font-semibold">Productos Colombia</p>
                        <p className="text-gray-500 text-sm mt-1">
                            &copy; 2025 Amin Proyecto. Todos los derechos reservados.
                        </p>
                    </div>

                    {/* Sección para redes sociales / links futuros */}
                    <div className="flex items-center gap-3">
                        <div className="bg-green-200 rounded-full w-10 h-10 flex justify-center items-center text-green-700 font-bold">
                            SM
                        </div>
                        <p className="text-gray-500 text-sm">Redes sociales (próximamente)</p>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default PublicLayout