import { BarChart3, ScanBarcode, MessagesSquare, ArrowUpRight, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

function DashboardPage() {
  const openWhatsApp = () => {
    window.open('https://wa.me/+573117894828', '_blank');
  };

  return (
    <div className="p-6 h-full">
      {/* Grid Container */}
      <div className="grid grid-cols-3 gap-6 auto-rows-min h-full">
        {/* Ingresos Totales - Ocupa 2 columnas */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ingresos Totales</h2>
              <p className="text-gray-500">Resumen mensual de ingresos</p>
            </div>
            <BarChart3 className="text-gray-400 size-8" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-green-600" />
                <span className="text-green-600 font-medium">Este Mes</span>
              </div>
              <p className="text-2xl font-bold">$12,350</p>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="size-4" />
                <span className="text-sm">12% más que el mes pasado</span>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-gray-600" />
                <span className="text-gray-600 font-medium">Mes Pasado</span>
              </div>
              <p className="text-2xl font-bold">$11,023</p>
            </div>
          </div>
        </div>

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
  )
}

export default DashboardPage