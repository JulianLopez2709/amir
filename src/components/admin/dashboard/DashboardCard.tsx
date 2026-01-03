// components/DashboardCard.tsx
import { LucideIcon } from "lucide-react"

interface DashboardCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    color?: string
    textColor?: string
    bgColor?: string
    subtitle?: string
}

export const DashboardCard = ({ title, value, icon: Icon, textColor="black", color = "white", bgColor = "bg-green-400", subtitle }: DashboardCardProps) => {
    return (
        <div className={`flex items-center justify-center p-4 rounded-xl ${bgColor} text-center flex-1 gap-2`}>
            <div>
                <p className="text-sm font-medium" style={{ color: textColor }}>{title}</p>
                <span className="text-2xl font-bold" style={{ color: textColor }}>{value}</span>
            </div>

             <div className=" justify-start items-start  h-full hidden md:flex">
                <div className={`p-3 rounded-lg bg-white/20 flex items-center justify-center`}>
                    <Icon className={`size-6`} style={{ color }} />
                </div>
            </div>
            {/*subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>*/}
        </div>
    )
}
