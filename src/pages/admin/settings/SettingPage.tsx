import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import PasswordInput from '@/components/admin/settings/PasswordInput'
import {
    buildFactusPatchPayload,
    getCompanyProfile,
    patchCompanyFactusSettings,
    patchCompanyProfile,
    uploadCompanyLogo,
    validateFactusConnection,
} from '@/api/company/companySettings'
import {
    EMPTY_FACTUS_FORM,
    type AminRole,
    type CompanyProfileForm,
    type FactusCredentialsForm,
    type TeamMember,
} from '@/@types/settings'
import {
    PERMISSION_LABELS,
    ROLE_BADGE_VARIANT,
    ROLE_LABELS,
    ROLE_PERMISSIONS,
} from '@/config/roles'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Building2,
    CreditCard,
    Loader2,
    MoreHorizontal,
    Pencil,
    Receipt,
    Shield,
    UserPlus,
    Users,
} from 'lucide-react'

const ROLES: AminRole[] = ['ADMIN', 'SUPERVISOR', 'CAJERO', 'MESERO']

const EMPTY_BUSINESS_FORM: CompanyProfileForm = {
    name: '',
    nit: '',
    address: '',
    phone: '',
    email: '',
    primary_color: '#309b5c',
    secondary_color: '#309b5c',
}

function mapAuthRoleToAminRole(role?: string | null): AminRole {
    const normalized = (role ?? '').toLowerCase()
    if (normalized === 'admin' || normalized === 'administrador') return 'ADMIN'
    if (normalized === 'supervisor') return 'SUPERVISOR'
    if (normalized === 'cajero' || normalized === 'cashier') return 'CAJERO'
    if (normalized === 'mesero' || normalized === 'waiter' || normalized === 'asesor') return 'MESERO'
    return 'MESERO'
}

function SettingPage() {
    const { company, user, setCompany } = useAuth()
    const companyData = company

    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [isEditBusinessOpen, setIsEditBusinessOpen] = useState(false)
    const [businessForm, setBusinessForm] = useState<CompanyProfileForm>(EMPTY_BUSINESS_FORM)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [isSavingBusiness, setIsSavingBusiness] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState<AminRole>('MESERO')

    const [factusForm, setFactusForm] = useState<FactusCredentialsForm>(EMPTY_FACTUS_FORM)
    const [isSavingFactus, setIsSavingFactus] = useState(false)
    const [isValidatingFactus, setIsValidatingFactus] = useState(false)

    const isFactusConfigured = Boolean(companyData?.factusElectronicInvoicingConfigured)
    const isAdmin = (companyData?.role ?? '').toLowerCase() === 'admin'

    useEffect(() => {
        if (!companyData?.id) return

        let cancelled = false
        setIsLoadingProfile(true)

        getCompanyProfile(companyData.id)
            .then((profile) => {
                if (cancelled) return
                setCompany({ ...companyData, ...profile, role: profile.role ?? companyData.role })
            })
            .catch((err) => {
                if (!cancelled) {
                    toast.error(err instanceof Error ? err.message : 'No se pudo cargar la compañía')
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingProfile(false)
            })

        return () => {
            cancelled = true
        }
    }, [companyData?.id])

    useEffect(() => {
        if (!companyData) return
        setFactusForm({
            ...EMPTY_FACTUS_FORM,
            factusNumberingRangeId: companyData.factusNumberingRangeId
                ? String(companyData.factusNumberingRangeId)
                : '',
            factusPrefix: companyData.factusPrefix ?? '',
        })
    }, [companyData?.id, companyData?.factusNumberingRangeId, companyData?.factusPrefix])

    const teamMembers: TeamMember[] = useMemo(() => {
        if (!user || !companyData) return []
        return [
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: mapAuthRoleToAminRole(companyData.role ?? company?.role),
                status: 'active',
            },
        ]
    }, [user, companyData, company?.role])

    const openEditBusiness = () => {
        if (!companyData) return
        setBusinessForm({
            name: companyData.name ?? '',
            nit: companyData.nit ?? '',
            address: companyData.address ?? '',
            phone: companyData.phone ?? '',
            email: companyData.email ?? '',
            primary_color: companyData.primary_color ?? '#309b5c',
            secondary_color: companyData.secondary_color ?? '#309b5c',
        })
        setLogoFile(null)
        setLogoPreview(companyData.logo ?? null)
        setIsEditBusinessOpen(true)
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleSaveBusiness = async () => {
        if (!companyData?.id) return
        if (!isAdmin) {
            toast.error('Solo el administrador puede editar la información del negocio')
            return
        }
        if (!businessForm.name.trim()) {
            toast.error('El nombre del negocio es obligatorio')
            return
        }

        setIsSavingBusiness(true)
        try {
            let updated = await patchCompanyProfile(companyData.id, {
                name: businessForm.name.trim(),
                nit: businessForm.nit.trim(),
                address: businessForm.address.trim(),
                phone: businessForm.phone.trim(),
                email: businessForm.email.trim(),
                primary_color: businessForm.primary_color,
                secondary_color: businessForm.secondary_color,
            })

            if (logoFile) {
                updated = await uploadCompanyLogo(companyData.id, logoFile)
            }

            setCompany({ ...companyData, ...updated, role: updated.role ?? companyData.role })
            setIsEditBusinessOpen(false)
            toast.success('Información del negocio actualizada')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al guardar la información')
        } finally {
            setIsSavingBusiness(false)
        }
    }

    const handleSaveFactus = async () => {
        if (!companyData?.id) return
        if (!isAdmin) {
            toast.error('Solo el administrador puede configurar Factus')
            return
        }

        if (!isFactusConfigured) {
            const missing = [
                !factusForm.factusClientId.trim() && 'Client ID',
                !factusForm.factusClientSecret.trim() && 'Client Secret',
                !factusForm.factusUsername.trim() && 'Usuario',
                !factusForm.factusPassword.trim() && 'Contraseña',
            ].filter(Boolean)
            if (missing.length) {
                toast.error(`Completa: ${missing.join(', ')}`)
                return
            }
        }

        const payload = buildFactusPatchPayload(factusForm, isFactusConfigured)
        const hasChanges = Object.keys(payload).length > 0

        if (!hasChanges) {
            toast.message('No hay cambios para guardar')
            return
        }

        setIsSavingFactus(true)
        try {
            const updated = await patchCompanyFactusSettings(companyData.id, payload)
            setCompany({ ...companyData, ...updated, role: companyData.role })
            setFactusForm((prev) => ({
                ...EMPTY_FACTUS_FORM,
                factusNumberingRangeId: updated.factusNumberingRangeId
                    ? String(updated.factusNumberingRangeId)
                    : prev.factusNumberingRangeId,
                factusPrefix: updated.factusPrefix ?? prev.factusPrefix,
            }))
            toast.success('Credenciales Factus guardadas')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al guardar credenciales')
        } finally {
            setIsSavingFactus(false)
        }
    }

    const handleValidateFactus = async () => {
        if (!companyData?.id) return
        if (!isAdmin) {
            toast.error('Solo el administrador puede validar Factus')
            return
        }
        if (!isFactusConfigured) {
            toast.error('Guarda las credenciales antes de validar la conexión')
            return
        }

        setIsValidatingFactus(true)
        try {
            await validateFactusConnection(companyData.id)
            toast.success('Conexión con Factus validada correctamente')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo validar la conexión')
        } finally {
            setIsValidatingFactus(false)
        }
    }

    if (!companyData) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">Selecciona una compañía para ver la configuración.</p>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50/60">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 space-y-6">
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Configuración</h1>
                    <p className="text-sm text-gray-500">
                        Centro administrativo de tu negocio.
                    </p>
                </header>

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {/* Información del negocio — 4 cols */}
                    <div className="col-span-12 lg:col-span-4">
                        <Card className="h-full">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    Información del Negocio
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoadingProfile && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Cargando datos...
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 shrink-0 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {companyData.logo ? (
                                            <img src={companyData.logo} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <Building2 className="h-7 w-7 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-2 text-sm">
                                        <InfoRow label="Nombre" value={companyData.name} />
                                        <InfoRow label="NIT" value={companyData.nit} placeholder="Sin registrar" />
                                        <InfoRow label="Dirección" value={companyData.address} placeholder="Sin registrar" />
                                        <InfoRow label="Teléfono" value={companyData.phone} placeholder="Sin registrar" />
                                        <InfoRow label="Correo" value={companyData.email} placeholder="Sin registrar" />
                                        <div className="flex gap-2 min-w-0 items-center text-sm">
                                            <span className="text-gray-500 shrink-0 w-16">Colores:</span>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-5 w-5 rounded border shrink-0"
                                                    style={{ backgroundColor: companyData.primary_color }}
                                                    title="Color primario"
                                                />
                                                <span
                                                    className="h-5 w-5 rounded border shrink-0"
                                                    style={{ backgroundColor: companyData.secondary_color }}
                                                    title="Color secundario"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    disabled={!isAdmin || isLoadingProfile}
                                    onClick={openEditBusiness}
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar información
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Equipo y Roles — 8 cols */}
                    <div className="relative col-span-12 lg:col-span-8">

                        <div className="absolute inset-0 z-10 flex top-20 justify-center h-44 p-2 ">
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
                        <Card className="h-full blur-sm pointer-events-none">
                            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                        Equipo y Roles
                                    </CardTitle>
                                    <CardDescription className="mt-1.5">
                                        Administra quién accede al POS y qué puede hacer en tu negocio.
                                    </CardDescription>
                                </div>
                                <Button className="shrink-0 gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsInviteOpen(true)}>
                                    <UserPlus className="h-4 w-4" />
                                    Invitar usuario
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Correo</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teamMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell className="text-gray-600">{member.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={ROLE_BADGE_VARIANT[member.role]}>
                                                        {ROLE_LABELS[member.role]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={member.status === 'active' ? 'active' : 'inactive'}>
                                                        {member.status === 'active' ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem disabled>Cambiar rol</DropdownMenuItem>
                                                            <DropdownMenuItem disabled>Ver permisos</DropdownMenuItem>
                                                            <DropdownMenuItem disabled className="text-red-600">
                                                                Desactivar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="mt-4 rounded-lg border bg-gray-50/80 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                                        Arquitectura de permisos
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {ROLES.map((role) => (
                                            <div key={role} className="rounded-md border bg-white p-2.5">
                                                <Badge variant={ROLE_BADGE_VARIANT[role]} className="mb-2">
                                                    {ROLE_LABELS[role]}
                                                </Badge>
                                                <ul className="space-y-0.5">
                                                    {ROLE_PERMISSIONS[role].slice(0, 3).map((perm) => (
                                                        <li key={perm} className="text-[10px] text-gray-500 truncate">
                                                            {PERMISSION_LABELS[perm]}
                                                        </li>
                                                    ))}
                                                    {ROLE_PERMISSIONS[role].length > 3 && (
                                                        <li className="text-[10px] text-gray-400">
                                                            +{ROLE_PERMISSIONS[role].length - 3} más
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Facturación Electrónica — full width */}
                    <div className="col-span-12">
                        <Card className="border-indigo-100">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Receipt className="h-5 w-5 text-indigo-600" />
                                            Facturación Electrónica — Factus
                                        </CardTitle>
                                        <CardDescription className="mt-1.5 max-w-2xl">
                                            Configura las credenciales necesarias para emitir facturas electrónicas.
                                            Los secretos se almacenan cifrados en el servidor y nunca se exponen en el
                                            frontend.
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={isFactusConfigured ? 'active' : 'inactive'}
                                        className="shrink-0 self-start"
                                    >
                                        {isFactusConfigured ? 'Configurado' : 'Sin configurar'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', !isAdmin && 'opacity-60')}>
                                    <FactusField
                                        label="Client ID"
                                        hint={isFactusConfigured ? 'Dejar vacío para mantener el actual' : undefined}
                                    >
                                        <Input
                                            value={factusForm.factusClientId}
                                            onChange={(e) =>
                                                setFactusForm((p) => ({ ...p, factusClientId: e.target.value }))
                                            }
                                            placeholder={isFactusConfigured ? '••••••••' : 'Client ID de Factus'}
                                            autoComplete="off"
                                            disabled={!isAdmin}
                                        />
                                    </FactusField>

                                    <FactusField
                                        label="Client Secret"
                                        hint={isFactusConfigured ? 'Dejar vacío para mantener el actual' : undefined}
                                    >
                                        <PasswordInput
                                            value={factusForm.factusClientSecret}
                                            onChange={(v) => setFactusForm((p) => ({ ...p, factusClientSecret: v }))}
                                            placeholder={isFactusConfigured ? '••••••••' : 'Client Secret'}
                                            disabled={!isAdmin}
                                        />
                                    </FactusField>

                                    <FactusField
                                        label="Usuario Factus"
                                        hint={isFactusConfigured ? 'Dejar vacío para mantener el actual' : undefined}
                                    >
                                        <Input
                                            value={factusForm.factusUsername}
                                            onChange={(e) =>
                                                setFactusForm((p) => ({ ...p, factusUsername: e.target.value }))
                                            }
                                            placeholder={isFactusConfigured ? '••••••••' : 'Usuario'}
                                            autoComplete="off"
                                            disabled={!isAdmin}
                                        />
                                    </FactusField>

                                    <FactusField
                                        label="Contraseña Factus"
                                        hint={isFactusConfigured ? 'Dejar vacío para mantener el actual' : undefined}
                                    >
                                        <PasswordInput
                                            value={factusForm.factusPassword}
                                            onChange={(v) => setFactusForm((p) => ({ ...p, factusPassword: v }))}
                                            placeholder={isFactusConfigured ? '••••••••' : 'Contraseña'}
                                            disabled={!isAdmin}
                                        />
                                    </FactusField>

                                    <FactusField label="ID rango de numeración">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={factusForm.factusNumberingRangeId}
                                            onChange={(e) =>
                                                setFactusForm((p) => ({ ...p, factusNumberingRangeId: e.target.value }))
                                            }
                                            placeholder="Ej: 12345"
                                            disabled={!isAdmin}
                                        />
                                    </FactusField>

                                    <FactusField label="Prefijo de factura">
                                        <Input
                                            value={factusForm.factusPrefix}
                                            onChange={(e) =>
                                                setFactusForm((p) => ({ ...p, factusPrefix: e.target.value }))
                                            }
                                            placeholder="Ej: SETP"
                                            disabled={!isAdmin}
                                        />
                                    </FactusField>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-6">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto gap-2"
                                    disabled={!isAdmin || isValidatingFactus}
                                    onClick={handleValidateFactus}
                                >
                                    {isValidatingFactus ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Shield className="h-4 w-4" />
                                    )}
                                    Validar conexión
                                </Button>
                                <Button
                                    className="w-full sm:flex-1 sm:max-w-xs gap-2 bg-indigo-600 hover:bg-indigo-700"
                                    disabled={!isAdmin || isSavingFactus}
                                    onClick={handleSaveFactus}
                                >
                                    {isSavingFactus && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Guardar credenciales
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Suscripción — full width */}
                    <div className="col-span-12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-gray-500" />
                                    Suscripción
                                </CardTitle>
                                <CardDescription>Plan y vigencia de tu cuenta AMIN.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border p-4 bg-white">
                                    <div>
                                        <p className="text-sm text-gray-500">Plan actual</p>
                                        <p className="text-lg font-semibold capitalize">
                                            {companyData.plan ?? 'Básico'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estado</p>
                                        <Badge variant="active">Activo</Badge>
                                    </div>
                                    <Button variant="outline" disabled className="shrink-0">
                                        Actualizar plan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={isEditBusinessOpen} onOpenChange={setIsEditBusinessOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar información del negocio</DialogTitle>
                        <DialogDescription>
                            Actualiza los datos de contacto, colores de marca y logo de tu negocio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <Building2 className="h-7 w-7 text-gray-400" />
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Logo</label>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => logoInputRef.current?.click()}
                                >
                                    Cambiar logo
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Nombre del negocio</label>
                            <Input
                                value={businessForm.name}
                                onChange={(e) => setBusinessForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Nombre comercial"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">NIT</label>
                            <Input
                                value={businessForm.nit}
                                onChange={(e) => setBusinessForm((p) => ({ ...p, nit: e.target.value }))}
                                placeholder="NIT o documento"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Dirección</label>
                            <Input
                                value={businessForm.address}
                                onChange={(e) => setBusinessForm((p) => ({ ...p, address: e.target.value }))}
                                placeholder="Dirección del local"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input
                                value={businessForm.phone}
                                onChange={(e) => setBusinessForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="Teléfono de contacto"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Correo</label>
                            <Input
                                type="email"
                                value={businessForm.email}
                                onChange={(e) => setBusinessForm((p) => ({ ...p, email: e.target.value }))}
                                placeholder="correo@negocio.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ColorField
                                label="Color primario"
                                value={businessForm.primary_color}
                                onChange={(v) => setBusinessForm((p) => ({ ...p, primary_color: v }))}
                            />
                            <ColorField
                                label="Color secundario"
                                value={businessForm.secondary_color}
                                onChange={(v) => setBusinessForm((p) => ({ ...p, secondary_color: v }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditBusinessOpen(false)} disabled={isSavingBusiness}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveBusiness} disabled={isSavingBusiness} className="gap-2">
                            {isSavingBusiness && <Loader2 className="h-4 w-4 animate-spin" />}
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog: Invitar usuario */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Invitar usuario</DialogTitle>
                        <DialogDescription>
                            Envía una invitación por correo. La gestión de usuarios estará disponible próximamente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Correo electrónico</label>
                            <Input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="usuario@negocio.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Rol</label>
                            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AminRole)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {ROLE_LABELS[role]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-lg border bg-gray-50 p-3">
                            <p className="text-xs font-medium text-gray-600 mb-2">Permisos del rol seleccionado</p>
                            <div className="flex flex-wrap gap-1.5">
                                {ROLE_PERMISSIONS[inviteRole].map((perm) => (
                                    <Badge key={perm} variant="outline" className="text-[10px] font-normal">
                                        {PERMISSION_LABELS[perm]}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            disabled={!inviteEmail.trim()}
                            onClick={() => {
                                toast.message('Invitaciones disponibles próximamente')
                                setIsInviteOpen(false)
                            }}
                        >
                            Enviar invitación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ColorField({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-2">
                <Input
                    type="color"
                    className="w-14 h-10 p-1 cursor-pointer"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <Input
                    type="text"
                    className="font-mono text-sm uppercase"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#309B5C"
                />
            </div>
        </div>
    )
}

function InfoRow({
    label,
    value,
    placeholder = '—',
}: {
    label: string
    value?: string | null
    placeholder?: string
}) {
    return (
        <div className="flex gap-2 min-w-0">
            <span className="text-gray-500 shrink-0 w-16">{label}:</span>
            <span className={cn('font-medium truncate', !value && 'text-gray-400 font-normal')}>
                {value?.trim() || placeholder}
            </span>
        </div>
    )
}

function FactusField({
    label,
    hint,
    children,
}: {
    label: string
    hint?: string
    children: ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">{label}</label>
            {children}
            {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
    )
}

export default SettingPage
