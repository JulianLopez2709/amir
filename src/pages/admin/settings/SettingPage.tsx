import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { useAuth } from '@/context/AuthContext'
import { Building2, CloudUpload, ShieldCheck, Users, Wallet } from 'lucide-react'

function SettingPage() {
    const { company } = useAuth()
    const isMaintenance = true
    return (
        <div className='relative p-2'>
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

            <div className={`transition-all ${isMaintenance ? 'blur-sm pointer-events-none select-none' : ''} `}>

                <div className='grid grid-cols-5 gap-4'>
                    {/* Sección 1: Detalles de la Compañía (3 columnas) */}
                    <div className='col-span-3 bg-white p-6 rounded-lg shadow-sm'>
                        <h2 className='text-xl font-bold mb-6'>Detalles de la Compañía</h2>
                        <div className='space-y-6'>
                            <div>
                                <p className='text-sm font-medium mb-2'>Nombre del Negocio</p>
                                <Input placeholder={company?.name} disabled value={company?.name} />
                            </div>

                            <div>
                                <p className='text-sm font-medium mb-2'>Logo del Negocio</p>
                                <div className='flex gap-4 items-start'>
                                    <div className='w-24 h-24 bg-gray-50 flex items-center justify-center rounded-lg border'>
                                        {company?.logo ? (
                                            <img src={company?.logo} alt="logo" className='w-full h-full object-cover rounded-lg' />
                                        ) : (
                                            <Building2 className='size-8 text-gray-400' />
                                        )}
                                    </div>
                                    <div>
                                        <Button className='mb-2 flex items-center gap-2'>
                                            <CloudUpload className='size-4' />
                                            <span>Reemplazar logo</span>
                                        </Button>
                                        <p className='text-sm text-gray-500'>Actualiza el logo de tu negocio</p>
                                        <p className='text-sm text-gray-400'>PNG, JPG o WEBP (máximo 2MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm font-medium mb-2'>Dirección</p>
                                    <Input placeholder='Dirección' disabled />
                                </div>
                                <div>
                                    <p className='text-sm font-medium mb-2'>Tipo de Negocio</p>
                                    <Select>
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem value="restaurant">Restaurant</SelectItem>
                                            <SelectItem value="service">Servicios</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm font-medium mb-2'>Color Primario</p>
                                    <div className='flex items-center gap-2'>
                                        <input type="color" className='h-10 w-20' value={company?.primary_color || '#000000'} />
                                        <Input value={company?.primary_color || '#000000'} disabled className='uppercase' />
                                    </div>
                                </div>
                                <div>
                                    <p className='text-sm font-medium mb-2'>Color Secundario</p>
                                    <div className='flex items-center gap-2'>
                                        <input type="color" className='h-10 w-20' value={company?.secondary_color || '#000000'} />
                                        <Input value={company?.secondary_color || '#000000'} disabled className='uppercase' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Opciones de Desarrollo (2 columnas) */}
                    <div className='col-span-2 bg-white p-6 rounded-lg shadow-sm'>
                        <h2 className='text-xl font-bold mb-6'>Opciones de Desarrollo</h2>
                        <div className='space-y-4'>
                            <div className='p-4 border rounded-lg'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <ShieldCheck className='size-5 text-blue-600' />
                                    <h3 className='font-semibold'>Modo Desarrollo</h3>
                                </div>
                                <p className='text-sm text-gray-600 mb-4'>Habilita funciones avanzadas y herramientas de desarrollo</p>
                                <Button variant="outline" className='w-full'>Activar Modo Desarrollo</Button>
                            </div>
                        </div>
                    </div>

                    {/* Sección 3.1: Suscripción (2 columnas) */}
                    <div className='col-span-2 flex flex-col gap-4'>
                        <div className='space-y-4 shadow-sm  bg-white p-6 rounded-lg' >
                            <h2 className='text-xl font-bold mb-6'>Suscripción</h2>
                            <div className='flex items-center gap-4 p-4 border rounded-lg'>
                                <Wallet className='size-8 text-green-600' />
                                <div>
                                    <h3 className='font-semibold'>Plan Actual: Básico</h3>
                                    <p className='text-sm text-gray-600'>Válido hasta: 31/12/2024</p>
                                </div>
                            </div>
                            {
                                //<Button className='w-full bg-green-600 hover:bg-green-700'>Actualizar Plan</Button>
                            }
                        </div>{/* Sección 3.2: Contacto WhatsApp (2 columnas) */}
                        <div className='col-span-2 bg-white p-6 rounded-lg shadow-sm'>
                            <h2 className='text-xl font-bold mb-6'>Contacto WhatsApp</h2>
                            <div className='space-y-4'>
                                <div className='flex items-center gap-4 p-4 border rounded-lg'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-8 text-green-600">
                                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                                    </svg>
                                    <div>
                                        <Input placeholder='+1234567890' className='mb-2' />
                                        <p className='text-sm text-gray-600'>Número para soporte y notificaciones</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Sección 4: Miembros (5 columnas) */}
                    <div className='col-span-3 bg-white p-6 rounded-lg shadow-sm'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='text-xl font-bold'>Miembros del Equipo</h2>
                            <Button>+ Añadir Miembro</Button>
                        </div>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-4 gap-4'>
                                {/* Ejemplo de tarjeta de miembro */}
                                <div className='p-4 border rounded-lg'>
                                    <div className='flex items-center gap-3 mb-3'>
                                        <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                                            <Users className='size-5 text-gray-600' />
                                        </div>
                                        <div>
                                            <h3 className='font-semibold'>John Doe</h3>
                                            <p className='text-sm text-gray-600'>Administrador</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className='w-full'>Gestionar</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SettingPage