import { BarChart3, ScanBarcode, MessagesSquare, ArrowUpRight, DollarSign, Bell, FileText, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext';
import { DashboardSummary, getDashboardSummary } from '@/api/dashboard/summary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardCard } from '@/components/admin/dashboard/DashboardCard';

function DashboardPage() {
  const { company } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const isMaintenance = true

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardSummary(company!.id)
        setSummary(data)
      } catch (error) {
        console.error("Error cargando dashboard", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [company])


  const openWhatsApp = () => {
    window.open('https://wa.me/+573117894828', '_blank');
  };

  const crecimiento =
    summary && summary.gananciasMesPasado.total > 0
      ? ((summary.gananciasMesActual.total - summary.gananciasMesPasado.total) / summary.gananciasMesPasado.total) * 100
      : 0

  if (loading) {
    return <div className="p-6">Cargando dashboard...</div>
  }

  return (
    <div className='relative'>
      {isMaintenance && (
        <div className="absolute inset-0 z-10 flex top-20 justify-center h-44 p-2">
          <div className="bg-white/90 backdrop-blur rounded-xl border shadow-lg p-8 max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Configuración en mantenimiento
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Estamos trabajando para mejorar esta sección.
              Vuelve pronto para ver las novedades.
            </p>

            <div className="text-xs text-gray-400">
              🚧 Próximamente
            </div>
          </div>
        </div>
      )}
      <div className="p-3 h-full w-full scrollbar-hide overflow-y-auto blur-sm pointer-events-none select-none">

        <h2 className='text-xl mb-2'>Excelente, estas teniendo buenas ordenes</h2>
        {/* Grid Container */}
        <div className="flex flex-col md:flex-row gap-2 h-full w-full pb-4">

          {/*Cantidad de ordenes*/}
          <div className='flex flex-col gap-2 flex-1 w-full '>
            <div className="grid grid-cols-3 gap-3">
              <DashboardCard title="Nuevas Ordenes" value={summary?.totalOrdenesHoy ?? 0} icon={Bell} textColor='white' />

              <DashboardCard title="Ordenes Finalizadas" value={summary?.ordenesFinalizadasHoy ?? 0} icon={FileText} bgColor="bg-white" color='green' />

              <DashboardCard title="Ordenes en Proceso" value={summary?.ordenesEnProceso.cantidad ?? 0} icon={Activity} bgColor="bg-white" color='yellow' />

            </div>


            {/* Ingresos Totales - Ocupa 2 columnas */}
            <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ingresos Totales</h2>
                </div>
                <BarChart3 className="text-gray-400 size-8" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Ganancia Hoy */}
                <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <DollarSign className="text-green-600 size-6 p-2 bg-green-100 rounded-lg" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-green-700">Ganancia Hoy</span>
                    <span className="text-xl font-bold text-green-900">
                      ${summary?.gananciasHoy?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                </div>

                {/* Ganancia Estimada */}
                <div className="flex items-center gap-3 bg-yellow-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <DollarSign className="text-yellow-600 size-6 p-2 bg-yellow-100 rounded-lg" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-yellow-700">Ganancia Estimada</span>
                    <span className="text-xl font-bold text-yellow-900">
                      ${summary?.gananciaEstimadaHoy?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500">Resumen mensual de ingresos</p>

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-600" />
                    <span className="text-green-600 font-medium">Este Mes</span>
                  </div>
                  <p className="text-2xl font-bold">
                    ${summary?.gananciasMesActual.total?.toLocaleString() ?? "0"}
                  </p>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="size-4" />
                    <span className="text-sm">
                      {crecimiento.toFixed(1)}% más que el mes pasado
                    </span>
                  </div>
                </div>

                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-gray-600" />
                    <span className="text-gray-600 font-medium">Mes Pasado</span>
                  </div>
                  <p className="text-2xl font-bold">
                    ${summary?.gananciasMesPasado.total?.toLocaleString() ?? "0"}
                  </p>
                </div>
              </div>
            </div>

            {/*Lista de ordenes*/}
            <div className='flex flex-col gap-2 md:flex-row w-full h-full'>

              <div className='bg-white p-4 rounded-xl flex-1 shadow flex flex-col'>
                <div className='flex justify-between items-center mb-3'>
                  <h3 className='font-bold text-lg'>Pedidos Pendientes</h3>
                  <span className='text-sm text-gray-500'>{summary?.ordenesEnProceso.cantidad ?? 0} órdenes</span>
                </div>

                <ScrollArea className='flex flex-col gap-2 max-h-96 mb-1'>
                  <div className='flex flex-col gap-2'>

                    {
                      summary?.ordenesEnProceso.ordenes.map((orden) => (
                        <div
                          key={orden.id}
                          className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                        >
                          <div className='flex flex-col'>
                            <span className='font-medium'>ID: {orden.id}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800'>
                              Pendiente
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              </div>

              <div className='relative bg-white p-2 rounded-xl flex-1 h-full min-h-72 shadow'>
                {isMaintenance && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-xl border shadow-lg p-8 max-w-sm text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Configuración en mantenimiento
                      </h3>

                      <div className="text-xs text-gray-400">
                        🚧 Próximamente
                      </div>
                    </div>
                  </div>
                )}
                <div className='blur-sm flex flex-col gap-5'>
                  <h3>Otras Lista</h3>
                  <div className='flex justify-between items-center gap-2 w-full h-auto'>
                    {/*Componente ejemplo*/}
                    <div className='p-2 min-h-8 min-w-10 md:w-20 md:h-20 rounded-xl text-center bg-green-500  justify-center items-center flex font-bold text-white'>CJ</div>
                    <p className='font-bold'>#id</p>
                    <div className='p-1 rounded-sm'>En Proceso</div>
                  </div>
                  <div className='flex justify-between items-center gap-2 w-full h-auto'>
                    {/*Componente ejemplo*/}
                    <div className='p-2 min-h-8 min-w-10 md:w-20 md:h-20 rounded-xl text-center bg-green-500  justify-center items-center flex font-bold text-white'>CJ</div>
                    <p className='font-bold'>#id</p>
                    <div className='p-1 rounded-sm'>En Proceso</div>
                  </div>
                  <div className='flex justify-between items-center gap-2 w-full h-auto'>
                    {/*Componente ejemplo*/}
                    <div className='p-2 min-h-8 min-w-10 md:w-20 md:h-20 rounded-xl text-center bg-green-500  justify-center items-center flex font-bold text-white'>CJ</div>
                    <p className='font-bold'>#id</p>
                    <div className='p-1 rounded-sm'>En Proceso</div>
                  </div>
                  <div className='flex justify-between items-center gap-2 w-full h-auto'>
                    {/*Componente ejemplo*/}
                    <div className='p-2 min-h-8 min-w-10 md:w-20 md:h-20 rounded-xl text-center bg-green-500  justify-center items-center flex font-bold text-white'>CJ</div>
                    <p className='font-bold'>#id</p>
                    <div className='p-1 rounded-sm'>En Proceso</div>
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div className='max-w-lg flex flex-col gap-2'>
            {/* Anuncios y Tips - Ocupa 1 columna */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Anuncios y Tips</h2>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <ScanBarcode className="text-blue-600 size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Lector de Código de Barras</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        ¡Optimiza tu inventario! Conecta un lector de código de barras para agilizar el registro de productos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <MessagesSquare className="text-purple-600 size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">Soporte 24/7</h3>
                      <p className="text-sm text-purple-700 mt-1">
                        ¿Necesitas ayuda? Nuestro equipo está disponible para asistirte en cualquier momento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Soporte - Ocupa 3 columnas */}
            <div className="col-span-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-2">¿Necesitas ayuda?</h2>
                  <p className="opacity-90">Contacta con nuestro equipo de soporte vía WhatsApp</p>
                </div>
                <Button
                  onClick={openWhatsApp}
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 py-3 flex items-center gap-2"
                >
                  <MessagesSquare className="size-5" />
                  Contactar Soporte
                </Button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

  )
}

export default DashboardPage