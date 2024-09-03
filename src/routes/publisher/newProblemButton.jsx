import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

export default function NewProblemButton({onClick}) {
    return (
        <Button
            size="icon"
            variant="default"
            className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg bg-blue-700"
            aria-label="Add item"
            onClick={onClick}
        >
            <Plus className="h-8 w-8" />
        </Button>
    )
}