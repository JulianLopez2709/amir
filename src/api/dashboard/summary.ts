import apiFetch from "../client"

export interface DashboardSummary {
    gananciasMesActual: { total: number }
    gananciasMesPasado: { total: number }
    gananciasHoy : number
    gananciaEstimadaHoy : number
    totalOrdenesHoy: number
    ordenesFinalizadasHoy: number
    ordenesEnProceso: { cantidad: number, ordenes: [
        {id:number}
    ] }
}

export const getDashboardSummary = async (companyId: number): Promise<DashboardSummary> => {
    console.log("data dashboard: ID: ", companyId)
    const response = await apiFetch<DashboardSummary>(`dashboard/summary/${companyId}`, {
        method: 'GET',
    })

    console.log("responde: -> ",response)

    if (!response) {
        throw new Error("Error obteniendo resumen del dashboard")
    }

    return response
}
