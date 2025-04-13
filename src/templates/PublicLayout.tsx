import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router-dom"

function PublicLayout() {
    return (
        <div className="h-full">
            <header className="flex justify-between items-center max-w-5xl py-3 m-auto">
                <div className="flex gap-3">
                    <p>Logo</p>
                    <p>Planes</p>
                    <p>Contacto</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline"><Link to="/auth">Ingresa</Link></Button>
                    <Button className="bg-green-700 text-white" variant="default"><Link to="/auth">Empieza gratis</Link></Button>
                </div>
            </header>

            <main className=""><Outlet /></main>

            <footer className="max-w-5xl py-3 m-auto">
                <div className="border-t-2 border-gray-200 py-5">Productos Colombia</div>
                <div className="w-full flex justify-between items-center border-t-2 border-gray-200 py-5">
                    <p>
                    copyright © 2025 Amir proyecto
                    </p>
                    <div className="bg-green-200">
                        <p className="p-5">social media</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default PublicLayout