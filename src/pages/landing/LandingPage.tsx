import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <>
        <section className="bg-green-50">
            <div className="flex max-w-5xl m-auto py-8">

            <div className="flex-col">
                <p>Software de gestion de producto y ventas.</p>
                <h1>Haz que todo sea mas facil y mas rapido si tu factura la tienes en tu telefono <span>Admin</span></h1>
                <p>Con Amir vendes y gestiona tu prodcutos de una forma facil y sencilla</p>
                <Button className="bg-green-700"><Link to="/auth">Empieza administrar tu negocio</Link></Button>
                <p>✅ Factura electronica.</p>
            </div>
            <div className="bg-gray-100 size-[400px]"></div>
            </div>

        </section>

        <section className="flex justify-around items-center max-w-5xl m-auto py-11">
            <div className="flex-col">
                <div className="size-[80px] bg-gray-200"></div>
                <h2 className="text-green-700">Sin descargas</h2>
                <p>Accedes desde cualquier dispositivo y lugar. Tu información se guarda en la nube.</p>
            </div>

            <div className="flex-col">
                <div className="size-[80px] bg-gray-200"></div>
                <h2 className="text-green-700">Sin descargas</h2>
                <p>Accedes desde cualquier dispositivo y lugar. Tu información se guarda en la nube.</p>
            </div>

            <div className="flex-col">
                <div className="size-[80px] bg-gray-200"></div>
                <h2 className="text-green-700">Sin descargas</h2>
                <p>Accedes desde cualquier dispositivo y lugar. Tu información se guarda en la nube.</p>
            </div>
        </section>
    </>
  )
}

export default LandingPage