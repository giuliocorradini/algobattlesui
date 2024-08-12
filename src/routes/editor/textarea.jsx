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
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
      onKeyDown={handleTab}/>)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
