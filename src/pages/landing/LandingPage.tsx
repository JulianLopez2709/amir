import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import logoV1 from "../../assets/logoV1.jpg";
import dashboardImg from "../../assets/dashboardimg.png";
import productsImg from "../../assets/productimg.png";
import cardOrderImg from "../../assets/imgordercard.png";
import { Cloud, Boxes, BarChart3 } from "lucide-react";
import { Clock, ListChecks, UtensilsCrossed } from "lucide-react"
import { Separator } from "@radix-ui/react-select";
import FAQItem from "@/components/home/FAQItem";
import { useState } from "react";


function LandingPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

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
                                <Button className="md:text-xl bg-green-700 md:p-6 mb-3 "><Link to="/auth">Empieza gratis</Link></Button>
                                <Button variant={"outline"} className="md:text-xl md:p-6 mb-3 "><Link to="/">Mirar Video</Link></Button>
                            </div>
                        </div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center top-20 left-40 w-14 h-14 text-4xl p-1">🍔</div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center top-40 right-34 w-16 h-16 text-4xl">🧾</div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center bottom-40 left-46 w-12 h-12 text-2xl">📊</div>
                        <div className="hidden lg:flex absolute rounded-full bg-white shadow-lg  items-center justify-center bottom-10 right-46 w-14 h-14 text-4xl">📱</div>
                    </div>
                    <div className="w-[80%] bg-gray-100 rounded-t-4xl overflow-hidden border-8 border-b-0 border-green-200 max-h-[350px] md:max-h-[650px]">
                        <img
                            className="w-full object-cover"
                            src={dashboardImg}
                            alt="Dashboard Amin"
                        />
                    </div>

                </div>

            </section>

            <section className="bg-green-700 p-2 mb-10">

            </section>

            {/*
            <section className="flex flex-col justify-center items-center gap-8 max-w-[85%] m-auto py-11 px-4">
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">Maneja tu compañia facil con Amin</h2>
                    <p className="md:w-[70%] text-center">Con Amin tu expericiencia va ser rapida y sencilla con tu equipo de trabajo</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-around">
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
                </div>
            </section>
            */}

            <section className="flex flex-col md:flex-row justify-center w-[90%] md:w-[80%] m-auto items-center gap-10 mb-10">
                <div className="  ">
                    <img
                        className=" object-cover"
                        src={cardOrderImg}
                        alt="Dashboard Amin"
                    />
                </div>
                <div className="flex flex-col justify-center items-center md:w-[70%]">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-center ">Maneja tu compañia facil con los estado de ordenes en Amin</h2>
                    <p className="md:w-[70%] text-center">Con Amin tu expericiencia va ser rapida y sencilla con tu equipo de trabajo</p>
                    <div className="mt-8 flex flex-col gap-6 w-full md:w-[80%]">

                        {/* Tiempo real */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                                <Clock className="w-5 h-5 text-green-700" />
                            </div>
                            <p className="text-gray-700">
                                <span className="font-semibold text-black">
                                    Actualizaciones en tiempo real:
                                </span>{" "}
                                Visualiza el estado de cada orden al instante y mantente informado en
                                cada etapa del proceso.
                            </p>
                        </div>

                        {/* Organización */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                                <ListChecks className="w-5 h-5 text-green-700" />
                            </div>
                            <p className="text-gray-700">
                                <span className="font-semibold text-black">
                                    Órdenes claras y organizadas:
                                </span>{" "}
                                Identifica fácilmente órdenes en proceso, y completadas.
                            </p>
                        </div>

                        {/* Cocina */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                                <UtensilsCrossed className="w-5 h-5 text-green-700" />
                            </div>
                            <p className="text-gray-700">
                                <span className="font-semibold text-black">
                                    Integración con cocina:
                                </span>{" "}
                                Mejora la comunicación entre caja y cocina con cambios de estado
                                automáticos.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            <section className="flex justify-center items-center gap-2 mb-10">
                <div className="flex flex-1 flex-col items-center m-2">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-20 mb-10">Realiza tus ordenes facilmente con Amin</h2>
                    <div className="bg-green-700 rounded-xl p-6 text-white max-w-2xl text-center mb-10 flex w-full gap-3">
                        <div className="flex justify-center items-center bg-white text-green-700 rounded-xl w-16 h-16">
                            <p>1</p>
                        </div>
                        <div className="flex flex-col flex-1 justify-center items-center">
                            <h3 className="text-xl lg:text-2xl font-bold mb-2">Selecciona tus productos</h3>
                            <p className="text-sm lg:text-lg">Agrega productos a tu orden de manera rapida y sencilla.</p>
                        </div>
                    </div>
                    <div className=" rounded-xl p-6 max-w-2xl text-center mb-10 w-full gap-3 flex border-2 ">
                        <div className="flex justify-center items-center text-white bg-green-700 rounded-xl w-16 h-16">
                            <p>2</p>
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <h3 className="text-xl lg:text-2xl font-bold mb-2">Administra los estados de tus órdenes</h3>
                            <p className="text-sm lg:text-lg">Visualiza y actualiza el estado de cada orden fácilmente: pendiente, en proceso o completada.</p>
                        </div>
                    </div>
                    <div className=" rounded-xl p-6 max-w-2xl text-center mb-10 w-full gap-3 flex border-2">
                        <div className="flex justify-center items-center text-white bg-green-700 rounded-xl w-16 h-16">
                            <p>3</p>
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <h3 className="text-xl font-bold mb-2 lg:text-2xl">Lleva tu contabilidad</h3>
                            <p className="text-sm lg:text-lg">Mantén un registro claro de tus órdenes y ganancias directamente en el sistema, sin complicaciones.</p>
                        </div>
                    </div>

                </div>

                <div className=" flex-1 hidden lg:flex flex-col">
                    <div className="mb-2">Descubre el poder de nuestro sistema POS, realiza tus pedidos rapidamente.</div>
                    <div className="bg-gray-100 rounded-4xl overflow-hidden border-8  border-green-200 mr-[-50%]">
                        <img
                            className="w-full object-cover"
                            src={productsImg}
                            alt="Dashboard Amin"
                        />
                    </div>
                </div>
            </section>
            {/*Pricing*/}

            {
                /*
                            <section className="mb-10">
                                <div className="bg-[#f0f1ec] flex flex-col justify-center items-center text-center py-10 ">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Elige tu plan</h2>
                                    <p className="mb-4">Selecciona el plan que mejor se adapte a tus necesidades.</p>
                                    <div className="relative  w-full flex justify-center items-center md:h-48">
                                        <div className="md:absolute flex flex-col md:flex-row justify-center items-center gap-10 md:bottom-[-60%]">
                                            <div className="bg-white p-6 rounded-xl shadow-lg mr-4">
                                                <h3 className="font-bold text-left text-2xl mb-4">Plan Pro</h3>
                                                <p className="font-bold text-left mb-2 flex items-baseline">
                                                    <span className="text-2xl align-text-top h-full">$</span>
                                                    <span className="text-5xl">100.000</span>
                                                    <span className="text-3xl">/2 Meses</span>
                                                </p>
                                                <Separator className=".y2" />
                                                <ul className="flex flex-col gap-2 text-left">
                                                    <li>✔ Facturación electrónica</li>
                                                    <li>✔ Soporte prioritario</li>
                                                    <li>✔ Acceso desde cualquier dispositivo</li>
                                                </ul>
                                                <Button className="mt-6 bg-green-700 text-white w-full rounded-xl"><Link to="/">Empieza gratis</Link></Button>
                                            </div>
                                            {/*
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
                                            /}
                
                                        </div>
                                        <div>
                                            <h2></h2>
                                            <p></p>
                                            <p></p>
                                        </div>
                                    </div>
                
                                </div>
                                <div className="bg-green-100 h-32">
                
                                </div>
                            </section>*/
            }

            {/*Preguntas Frecuentes*/}
            <section className="flex flex-col justify-center items-center gap-5 w-full min-h-[520px] md:min-h-[800px]">



                {/* Preguntas Frecuentes */}
                {/* Preguntas Frecuentes */}
                <div className="text-center mb-7">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        Preguntas frecuentes
                    </h2>
                    <p className="text-gray-500">
                        Hemos reunido algunas de las preguntas más comunes
                    </p>
                </div>

                <div className="flex flex-col w-[90%] md:w-[60%]  ">

                    {[
                        {
                            q: "¿Qué es Amin?",
                            a: "Amin es un sistema POS en la nube diseñado para restaurantes y negocios que necesitan gestionar ventas y inventario.",
                        },
                        {
                            q: "¿Amin es fácil de usar?",
                            a: "Sí. Amin está pensado para que cualquier persona pueda usarlo sin conocimientos técnicos. En minutos puedes empezar a vender.",
                        },
                        {
                            q: "¿Amin ofrece soporte?",
                            a: "Claro. Nuestro equipo brinda soporte para ayudarte cuando lo necesites.",
                        },
                        {
                            q: "¿Cómo empiezo a usar Amin?",
                            a: "Solo debes registrarte, crear tu compañía y comenzar a vender desde cualquier dispositivo.",
                        },
                    ].map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.q}
                            answer={item.a}
                            open={openIndex === index}
                            onToggle={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                        />
                    ))}
                </div>


            </section>

            {/*Solicitar demo*/}
            <section className="bg-green-700 flex flex-col justify-center items-center py-20 gap-5 text-white">
                <h2 className="text-4xl font-bold text-center">¿Listo para comenzar?</h2>
                <p className="text-center max-w-2xl">Empieza a usar Amin hoy mismo y lleva la gestión de tu negocio al siguiente nivel.</p>
                <Button className="md:text-2xl bg-white text-green-700 md:p-6 "><Link to="/auth">Empieza gratis</Link></Button>
            </section>
        </>
    )
}

export default LandingPage