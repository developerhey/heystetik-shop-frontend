import { Loader2 } from "lucide-react"

export function LoadingOverlay({ show }: { show: boolean }) {
    if (!show) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    )
}
