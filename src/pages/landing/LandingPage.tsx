import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import logoV1 from "../../assets/logoV1.jpg";
import productsImg from "../../assets/inventario.webp";
import { Cloud, Boxes, BarChart3 } from "lucide-react";

function LandingPage() {
    return (
        <>
            <section className="bg-green-50">
                <div className="flex max-w-7xl m-auto p-8">

                    <div className="flex-col md:w-[50%]">
                        <h1 className="text-2xl pb-3 opacity-80">Software de gestion de producto y ventas.</h1>
                        <h2 className="text-4xl font-bold pb-3">Haz que todo sea mas <span className="text-green-500">facil y mas rapido</span> si tu factura la tienes en tu telefono <span>Admin</span></h2>
                        <h2 className="text-xl pb-3 pr-7">Con Amin vendes y gestiona tu productos de una forma facil y sencilla</h2>
                        <Button className="text-2xl bg-green-700 p-5 mb-3 opacity-80 "><Link to="/createCompany">Empieza negocio gratis</Link></Button>
                        <p>✅ Factura electronica.</p>
                    </div>
                    <div className="hidden md:flex relative bg-gray-100 w-[50%] h-[460px] rounded-2xl overflow-hidden">
                        <img className="w-full h-[460px] object-cover " src={productsImg} alt="Logo Amin Adminstrador creado con IA" />
                        <div className="absolute bottom-0  ">
                            <img className=" h-32 w-auto bottom-0 end-0" src={logoV1} alt="Logo Amin Adminstrador creado con IA" />
                        </div>
                    </div>
                </div>

            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-around items-start max-w-7xl m-auto py-11 px-4 mb-40">
                <div className="flex flex-col  ">
                    <div className="flex bg-green-100 p-4 rounded-full mb-4 items-center gap-2">
                        <Cloud className="w-10 h-10 text-green-700" />
                        <h2 className="text-black text-xl font-bold">Acceso desde cualquier lugar</h2>
                    </div>
                    <p>Usa tu tablet, laptop o celular como punto de venta.</p>
                    <p>Accede desde cualquier dispositivo y lugar. Tu información se guardara.</p>
                </div>

                <div className="flex flex-col  ">
                    <div className="flex bg-green-100 p-4 rounded-full mb-4 items-center gap-2">
                        <Boxes className="w-10 h-10 text-green-700" />
                    <h2 className="text-black text-xl font-bold">Control de inventario</h2>

                    </div>
                    <p>Gestiona tu stock en tiempo real y ordénalo en categorías.</p>
                    {
                        //<p>Recibe alertas de productos bajos y evita quiebres de stock.</p>
                    }
                </div>

                <div className="flex flex-col  ">
                    <div className="flex bg-green-100 p-4 rounded-full mb-4 items-center gap-2">
                        <BarChart3 className="w-10 h-10 text-green-700" />
                    <h2 className="text-black text-xl font-bold ">Reportes automáticos</h2>

                    </div>
                    <p>Obtén reportes de ventas, ingresos y gastos automáticamente.</p>
                    {
                        //<p>Toma decisiones informadas para hacer crecer tu negocio.</p>
                    }
                </div>
            </section>

        </>
    )
}

export default LandingPage