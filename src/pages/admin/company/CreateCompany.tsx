import React, { useState } from 'react';
import imgRight from "@/assets/company/bdRightCompany.webp";
import imgLeft from "@/assets/company/bgCompany.webp";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageIcon, MoveRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select';

function CreateCompany() {
    const userId = 1; 
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [slogan, setSlogan] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#ffffff');
    const [secondaryColor, setSecondaryColor] = useState('#ffffff');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            companyName,
            companyType,
            slogan,
            primaryColor,
            secondaryColor,
            imageFile,
            userId
        };

        // Lógica para enviar a la base de datos vendría aquí
    };

    return (
        <div className='relative h-screen w-full flex justify-between items-center bg-black'>
            <div className="w-1/3 h-full opacity-80 ">
                <img
                    src={imgLeft}
                    alt="logo"
                    className="h-full w-full object-cover mask-r-from-0%"
                />
            </div>

            <div className="w-1/3 h-full opacity-80">
                <img
                    src={imgRight}
                    alt="logo"
                    className="h-full w-full object-cover mask-l-from-0%"
                />
            </div>

            <div className="absolute inset-0 flex justify-center items-center z-10">
                <div className="w-4xl bg-white shadow-2xl p-8 rounded-2xl m-2">
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <h1 className="text-3xl mb-3">Crea tu primera compañía</h1>

                        <div className='flex gap-3'>
                            <label className="relative cursor-pointer w-40 h-32 rounded-xl overflow-hidden border border-gray-300 shadow-md group hover:opacity-80 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="absolute h-full w-full bg-black bg-opacity-40 text-black text-center text-xs  transition">
                                    {previewUrl ? (
                                        <div>
                                            <img src={previewUrl} alt="preview" className="object-cover h-32 w-40" />
                                            <ImageIcon className="absolute top-0 p-8 text-black  w-full h-full opacity-40 hover:bg-white " size={20} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                                            Subir imagen
                                        </div>
                                    )}
                                </div>
                            </label>

                            <div className='w-full'>
                                <div className='flex gap-3 w-full'>
                                    <div className='w-full'>
                                        <label className="font-bold">Nombre de la Compañía</label>
                                        <Input
                                            placeholder='Nombre'
                                            type='text'
                                            required
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="font-bold">Tipo de compañía</label>
                                        <Select value={companyType} onValueChange={(value) => setCompanyType(value)}>
                                            <SelectTrigger className="w-full text-start p-2 text-sm bg-white border-2 rounded-md">
                                                <SelectValue className='text-gray-300 opacity-50' placeholder="Tipo de Producto" />
                                            </SelectTrigger>
                                            <SelectContent className='bg-white border-2 rounded-md'>
                                                <SelectGroup>
                                                    <SelectLabel className='bg-black rounded-sm text-white text-center px-2 w-48'>Tipo de Producto</SelectLabel>
                                                    <SelectItem value="combo">combo</SelectItem>
                                                    <SelectItem value="producto">producto</SelectItem>
                                                    <SelectItem value="servicio">servicio</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold">¿Cuál es el Slogan?</label>
                                    <Input
                                        placeholder='Slogan'
                                        type='text'
                                        value={slogan}
                                        onChange={(e) => setSlogan(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3 w-full'>
                            <div className='flex gap-3 w-full items-center'>
                                <label className="font-bold">Color Primario</label>
                                <Input
                                    className='w-20'
                                    type='color'
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                />
                                <Input
                                    className='bg-gray-100 w-1/3 font-bold'
                                    type='text'
                                    value={primaryColor.toUpperCase()}
                                    readOnly
                                />
                            </div>

                            <div className='flex gap-3 w-full items-center'>
                                <label className="font-bold">Color Secundario</label>
                                <Input
                                    className='w-20'
                                    type='color'
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                />
                                <Input
                                    className='bg-gray-100 w-1/3 font-bold'
                                    type='text'
                                    value={secondaryColor.toUpperCase()}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='text-end'>
                            <Button className='bg-green-700 text-white items-center cursor-pointer' type='submit'>
                                Crear Compañía <MoveRight />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCompany;
