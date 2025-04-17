import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import React from 'react'

function SettingPage() {

    return (
        <div>
            <div>
                <div className='flex'>
                    <div>
                        <p>logo del Negocio</p>
                        <p>Actualiza el logo de tu negocio</p>
                    </div>
                    <div>

                    </div>
                    <Button value="default">Remplazar logo</Button>
                </div>
                <div>
                    <p>Nombre del Negocio</p>
                    <Input placeholder='' />
                </div>
                <div>
                    <p>Direccion</p>
                    <Input placeholder='' />
                </div>
                <div>
                    Brand
                    <Select >
                        <SelectTrigger className="bg-white rounded-sm border-2 w-[180px]">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>   

                </div>
            </div>
        </div>
    )
}

export default SettingPage