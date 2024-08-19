import { Input } from "./ui/input"
import { cn } from "../lib/utils"
import { Label } from "./ui/label"

export function FormField({isError, className, ...props}) {
    if (isError) {
        return <div>
            <Input className={cn("border-2 border-rose-500", className)} {...props}></Input>
            <Label for={props.name} className="text-rose-500">This field is required.</Label>
            </div>
    } else {
        return <div>
            <Input className={className} {...props}></Input>
        </div>
    }
}
