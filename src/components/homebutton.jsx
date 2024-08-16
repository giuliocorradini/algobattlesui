import { Link } from "react-router-dom"
import { SwordsIcon } from "lucide-react"

export function HomeButton() {
    return <Link to="/" className="flex items-center gap-2 font-bold">
        <SwordsIcon className="h-6 w-6" />
        AlgoBattles
    </Link>
}
