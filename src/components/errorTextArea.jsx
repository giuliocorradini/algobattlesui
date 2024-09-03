import { cn } from "../lib/utils"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

export function ErrorTextArea({ error, errorLabel, className, ...props }) {
    if (error) {
        return <>
            <Textarea className={cn("border-2 border-rose-500", className)} {...props}></Textarea>
            <Label htmlFor={props.name} className="text-rose-500">{errorLabel}</Label>
        </>
    } else {
        return <Textarea className={className} {...props}></Textarea>
    }
}
