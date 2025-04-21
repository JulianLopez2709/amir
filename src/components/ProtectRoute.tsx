import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'


function ProtectRoute({ isAllow, children, redirectTo = "/" }: {isAllow: boolean, children?: React.ReactNode, redirectTo?: string}) {
    if (!isAllow) {
        console.log("No hay usuario, redirigiendo a la página de inicio");
        return <Navigate to={redirectTo} />;
    }
    return children ? children : <Outlet />;
}

export default ProtectRoute