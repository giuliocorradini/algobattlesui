import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"

export default function ButtonLoading(props) {
    return (
      <Button {...props} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    )
  }
  