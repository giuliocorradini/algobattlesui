import { Input } from "./ui/input"
import { cn } from "../lib/utils"
import { Label } from "./ui/label"

export function FormField({ error, errorLabel, className, ...props }) {
    if (error) {
        return <>
            <Input className={cn("border-2 border-rose-500", className)} {...props}></Input>
            <Label htmlFor={props.name} className="text-rose-500">{errorLabel}</Label>
        </>
    } else {
        return <Input className={className} {...props}></Input>
    }
}
