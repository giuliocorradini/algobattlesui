import React from "react"
import { useState } from "react"
import { FormField } from "./formfield"

/**
 * An input field that that becomes red to signal an error condition.
 */
export function ErrorInput({content, ...props}) {
    return <FormField value={content} {...props} required></FormField>
}

/**
 * An error input field that becomes red when its content goes blank.
 */
export function NonBlankInput({error, defaultValue, errorLabel, ...props}) {
    const [content, setContent] = useState(defaultValue)
    const err = error ? errorLabel : "This field is required."
    const requiredError = content == "" && content != defaultValue

    return <ErrorInput error={error || requiredError} content={content} setContent={setContent} errorLabel={err} {...props} onChange={e => {setContent(e.target.value)}}></ErrorInput>
}