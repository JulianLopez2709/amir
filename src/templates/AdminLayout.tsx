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
                <nav className="h-full flex-col justify-between border-r-2 border-gray-100">
                    <div className="p-2">
                        <div className="bg-[#2CEE12] size-[60px] rounded-2xl opacity-50">
                        <Link to="/">HOME</Link>

                        </div>

                        <div className="bg-[#12EE96] size-[60px] rounded-2xl opacity-50">
                        <Link to="/">P</Link>

                        </div>

                        <div className="bg-[#123EEE] size-[60px] rounded-2xl opacity-50">
                        <Link to="/">ORDEN</Link>

                        </div>
                        <div className="bg-[#B012EE] size-[60px] rounded-2xl opacity-50">
                        <Link to="/">SETING</Link>

                        </div>
                    </div>
                    <div className="p-5 w-full bg-green-700">
                        <Link to="/">OUT</Link>
                    </div>
                </nav>
                <main className="bg-[#EFEFEF] h-full w-full"><Outlet /></main>
            </div>
        </>
    )
}

export default AdminLayout