import { Outlet } from "react-router-dom"


function AdminLayout() {
    return (
        <>
            <header> Header Public </header>
            <main><Outlet /></main>
            <footer> Fotter Public</footer>
        </>
    )
}

export default AdminLayout