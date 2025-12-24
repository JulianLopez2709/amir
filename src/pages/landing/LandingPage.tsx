import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import logoV1 from "../../assets/logoV1.jpg";
import dashboardImg from "../../assets/dashboardimg.png";
import productsImg from "../../assets/productimg.png";
import { Cloud, Boxes, BarChart3 } from "lucide-react";
import { Separator } from "@radix-ui/react-select";

function LandingPage() {


    return (
        <>
            <section className="bg-green-50 z-10">
                <div className="flex flex-col justify-center items-center m-auto">

                    <div className="relative flex flex-col text-center mb-7 justify-center items-center pt-8 w-full">
                        <div className="flex flex-col w-[95%] md:w-[80%] text-center justify-center items-center ">
                            <h1 className="md:text-xl opacity-80 ">Software de gestion de producto y ventas</h1>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-bold mb-5 flex flex-col  w-full">Todo lo que tu <span>negocio necesita</span></h2>
                            <h2 className="text-xl md:w-[70%] text-center">Haz que todo sea mas <span className="text-green-500">facil y mas rapido</span> si tu factura la tienes en tu telefono</h2>
                            <div className="flex flex-row justify-center gap-5 mt-5">
                                <Button className="md:text-xl bg-green-700 md:p-6 mb-3 "><Link to="/createCompany">Empieza gratis</Link></Button>
                                <Button variant={"outline"} className="md:text-xl md:p-6 mb-3 "><Link to="/">Mirar Video</Link></Button>
                            </div>
                        </div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center top-20 left-40 w-14 h-14 text-4xl p-1">🍔</div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center top-40 right-34 w-16 h-16 text-4xl">🧾</div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center bottom-40 left-46 w-12 h-12 text-2xl">📊</div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center bottom-10 right-46 w-14 h-14 text-4xl">📱</div>
                    </div>
                    <div className="w-[85%] bg-gray-100 rounded-t-4xl overflow-hidden border-8 border-b-0 border-green-200 max-h-[350px] md:max-h-[750px]">
                        <img
                            className="w-full object-cover"
                            src={dashboardImg}
                            alt="Dashboard Amin"
                        />
                    </div>

                </div>

            </section>

            <section className="bg-green-700 p-2">

            </section>


            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-around items-start max-w-[85%] m-auto py-11 px-4 my-10">
                <div className="flex flex-col  ">
                    <p>✅ Factura electronica.</p>

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

                    <h2 className="text-xl pb-3 pr-7">Con Amin vendes y gestiona tu productos de una forma facil y sencilla</h2>

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

            <section className="flex justify-center items-center gap-2 mb-10">
                <div className="flex flex-1 flex-col items-center">
                    <h2 className="text-4xl font-bold text-center mt-20 mb-10">Realiza tus ordenes facilmente</h2>
                    <div className="bg-green-700 rounded-xl p-6 text-white max-w-2xl text-center mb-10 flex w-full gap-3">
                        <div className="flex justify-center items-center bg-white text-green-700 rounded-xl w-16 h-16">
                            <p>1</p>
                        </div>
                        <div className="flex flex-col flex-1 justify-center items-center">
                            <h3 className="text-2xl font-bold mb-2">Selecciona tus productos</h3>
                            <p className="text-lg">Agrega productos a tu orden de manera rapida y sencilla.</p>
                        </div>
                    </div>
                    <div className=" rounded-xl p-6 max-w-2xl text-center mb-10 w-full gap-3 flex border-2 ">
                        <div className="flex justify-center items-center text-white bg-green-700 rounded-xl w-16 h-16">
                            <p>2</p>
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <h3 className="text-2xl font-bold mb-2">Genera la factura</h3>
                            <p className="text-lg">Crea facturas profesionales en segundos.</p>
                        </div>
                    </div>
                    <div className=" rounded-xl p-6 max-w-2xl text-center mb-10 w-full gap-3 flex border-2">
                        <div className="flex justify-center items-center text-white bg-green-700 rounded-xl w-16 h-16">
                            <p>3</p>
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <h3 className="text-2xl font-bold mb-2">Envía y guarda</h3>
                            <p className="text-lg w-[90%]">Envía facturas por correo electrónico y guarda un registro digital.</p>
                        </div>
                    </div>

                </div>

                <div className=" flex-1 hidden lg:flex flex-col">
                    <div className="mb-2">Descubre el poder de nuestro sistema POS, realiza tus pedidos rapidamente.</div>
                    <div className="bg-gray-100 rounded-4xl overflow-hidden border-8  border-green-200 mr-[-60%]">
                        <img
                            className="w-full object-cover"
                            src={productsImg}
                            alt="Dashboard Amin"
                        />
                    </div>
                </div>
            </section>
            {/*Pricing*/}
            <section>
                <div className="bg-[#f0f1ec] flex flex-col justify-center items-center text-center py-10 ">
                    <h2 className="text-2xl">Elige tu plan</h2>
                    <p>Selecciona el plan que mejor se adapte a tus necesidades.</p>
                    <div className="relative  w-full flex justify-center items-center md:h-48">
                        <div className="md:absolute flex flex-col md:flex-row justify-center items-center gap-10 md:bottom-[-40%]">
                            <div className="bg-white p-6 rounded-xl shadow-lg mr-4">
                                <h3>Pro</h3>
                                <p><span>$</span>100.000<span>/2 Mese</span></p>
                                <Separator className="my-4" />
                                <ul className="flex flex-col gap-2 text-left">
                                    <li>✔ Facturación electrónica</li>
                                    <li>✔ Soporte prioritario</li>
                                    <li>✔ Acceso desde cualquier dispositivo</li>
                                </ul>
                                <Button className="mt-6 bg-green-700 text-white"><Link to="/">Empieza gratis</Link></Button>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg mr-4">
                                <h3>Pro</h3>
                                <p><span>$</span>100.000<span>/2 Mese</span></p>
                                <Separator className="my-4" />
                                <ul className="flex flex-col gap-2 text-left">
                                    <li>✔ Facturación electrónica</li>
                                    <li>✔ Soporte prioritario</li>
                                    <li>✔ Acceso desde cualquier dispositivo</li>
                                </ul>
                                <Button className="mt-6 bg-green-700 text-white"><Link to="/">Empieza gratis</Link></Button>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg mr-4">
                                <h3>Pro</h3>
                                <p><span>$</span>100.000<span>/2 Mese</span></p>
                                <Separator className="my-4" />
                                <ul className="flex flex-col gap-2 text-left">
                                    <li>✔ Facturación electrónica</li>
                                    <li>✔ Soporte prioritario</li>
                                    <li>✔ Acceso desde cualquier dispositivo</li>
                                </ul>
                                <Button className="mt-6 bg-green-700 text-white"><Link to="/">Empieza gratis</Link></Button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="bg-green-100 h-80">

                </div>
            </section>

            {/*Preguntas Frecuentes*/}
            <section className="flex flex-col justify-center items-center py-10 mb-10 gap-5">
                <h2>Preguntas Frecuentes</h2>
                <p></p>

            </section>

            {/*Solicitar demo*/}
            <section className="bg-green-700 flex flex-col justify-center items-center py-20 gap-5 text-white">
                <h2 className="text-4xl font-bold text-center">¿Listo para comenzar?</h2>
                <p className="text-center max-w-2xl">Empieza a usar Amin hoy mismo y lleva la gestión de tu negocio al siguiente nivel.</p>
                <Button className="md:text-2xl bg-white text-green-700 md:p-6 "><Link to="/">Empieza gratis</Link></Button>
            </section>
        </>
    )
}

export default LandingPage