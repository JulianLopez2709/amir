import { BarChart3, ScanBarcode, MessagesSquare, ArrowUpRight, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext';
import { DashboardSummary, getDashboardSummary } from '@/api/dashboard/summary';
import { ScrollArea } from '@/components/ui/scroll-area';

function DashboardPage() {
  const { company } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

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
    <div className="p-3 md:p-6 h-full">
      <h2 className='text-xl mb-2'>Excelente, estas teniendo buenas ordenes</h2>
      {/* Grid Container */}
      <div className="flex flex-col md:flex-row gap-2 h-full w-full pb-4">
        {/*Cantidad de ordenes*/}
        <div className='flex flex-col gap-2 flex-1 w-full '>
          <div className='flex gap-2 w-full justify-between items-center text-white'>
            <div className='flex-col items-center justify-center p-4 rounded-xl bg-green-800 text-center font-bold flex-1'><p>Nuevas Ordenes</p>  <span>{summary?.totalOrdenesHoy ?? 0}</span></div>
            <div className='flex-col items-center justify-center p-4 rounded-xl bg-green-800 text-center font-bold flex-1'><p>Total de Ordenes</p> <span>2</span></div>
            <div className='flex-col items-center justify-center p-4 rounded-xl bg-green-800 text-center font-bold flex-1'><p>Ordenes en Progreso</p> <span>2</span></div>
            <div className='flex-col items-center justify-center p-4 rounded-xl bg-green-800 text-center font-bold flex-1'><p>Ordenes en Progreso </p><span>2</span></div>
          </div>
          {/* Ingresos Totales - Ocupa 2 columnas */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ingresos Totales</h2>
                <p className="text-gray-500">Resumen mensu  al de ingresos</p>
              </div>
              <BarChart3 className="text-gray-400 size-8" />
            </div>

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

            <div className='bg-white p-2 rounded-xl flex flex-col flex-1 min-h-72 shadow'>
              <div className='flex gap-2'>
                <h3>Lista de Ordenes</h3>
                <p>{summary?.ordenesEnProceso.cantidad}</p>
              </div>
              <ScrollArea className=' flex flex-col gap-2 max-h-96 mb-1'>
                <div className='flex flex-col gap-1'>

                  {
                    summary?.ordenesEnProceso.ordenes.map((orden) => (
                      <div>
                        ID: {orden.id}
                      </div>
                    ))
                  }
                </div>
              </ScrollArea>
            </div>

            <div className='bg-white p-2 rounded-xl flex-1 h-full min-h-72 shadow'>
              <h3>Otras Lista</h3>
              <div className='flex justify-between items-center gap-2 w-full h-auto'>
                {/*Componente ejemplo*/}
                <div className='p-2 min-h-8 min-w-10 md:w-20 md:h-20 rounded-xl text-center bg-green-500  justify-center items-center flex font-bold text-white'>CJ</div>
                <p className='font-bold'>#id</p>
                <div className='p-1 rounded-sm'>En Proceso</div>

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
  )
}

export default DashboardPage