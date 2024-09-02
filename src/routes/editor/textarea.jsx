import * as React from "react"

import { cn } from "../../lib/utils"

function handleTab(evt) {
  if(evt.key == 'Tab') {
    evt.preventDefault()

    const value = evt.target.value

    const cursorPosition = evt.target.selectionStart
    const cursorEndPosition = evt.target.selectionEnd

    evt.target.value =
      value.substring(0, cursorPosition) +
      '\t' +
      value.substring(cursorEndPosition)

    evt.target.selectionStart = cursorPosition + 1
    evt.target.selectionEnd = cursorPosition + 1
  } 
}

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "min-h-[80px] w-full bg-background text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
      onKeyDown={handleTab}/>)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
