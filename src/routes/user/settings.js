import React from "react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Switch } from "../../components/ui/switch"
import { Form, Link, useNavigate } from "react-router-dom"
import { SwordsIcon } from "lucide-react"
import { AccountButton } from "../../components/accountbutton"
import { useContext, useEffect, useState } from "react"
import { AuthenticationContext, CurrentUserContext } from "../../lib/api"
import { FetchUserInfo, UpdatePassword, UpdateUserInfo, UploadPicture } from "../../lib/api/user"
import { FormField } from "../../components/formfield"

/**
 * An input field that that becomes red to signal an error condition.
 */
function ErrorInput({content, ...props}) {
    return <FormField value={content} {...props} required></FormField>
}

/**
 * An error input field that becomes red when its content goes blank.
 */
function NonBlankInput({error, defaultValue, errorLabel, ...props}) {
    const [content, setContent] = useState(defaultValue)
    const err = error ? errorLabel : "This field is required."
    const requiredError = content == "" && content != defaultValue

    return <ErrorInput error={error || requiredError} content={content} setContent={setContent} errorLabel={err} {...props} onChange={e => {setContent(e.target.value)}}></ErrorInput>
}

function Header({user}) {
    return <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
            <SwordsIcon className="h-6 w-6" />
            AlgoBattles
        </Link>
        <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
        </div>
    </header>
}

function StickyPageNavigation({title, children}) {
    const [active, setActive] = useState(0)

    /**
     * @returns Classname only if element is active. Otherwise empty
     */
    function activeCn(key) {
        if (key == active)
            return "font-semibold text-primary"
        return ""
    }

    return <div className="md:sticky top-10">
        <nav className="text-sm text-muted-foreground grid gap-4">
            <div className="max-w-6xl w-full mx-auto text-primary">
                <h1 className="font-semibold text-3xl">{title}</h1>
            </div>
            {children.map(
                (child, i) => {return React.cloneElement(child, {onClick: () => setActive(i), key: i, className: activeCn(i)})}
            )}
        </nav>
    </div>
}

export default function SettingsPage() {
    const auth = useContext(AuthenticationContext)
    const {user, setUser} = useContext(CurrentUserContext)
    const navigate = useNavigate()
    const initials = user.username ? user.username.substring(0, 2) : ""

    useEffect(() => {
        if (!auth.isLogged)
            navigate("/login")  //TODO: better, check token and decide to login
    }, [])

    const [errors, setErrors] = useState({})
    const hasErrors = (field) => field in errors
    const errorFor = (field) => errors[field]
    const errs = (field) => {return {
        error: hasErrors(field),
        errorLabel: errorFor(field)
    }}

    function handleSubmit(evt) {
        evt.preventDefault()

        const formData = evt.target;
        const requestData = {
            username: formData.username.value,
            email: formData.email.value,
            first_name: formData.first_name.value,
            last_name: formData.last_name.value,
            github: formData.github.value,
            linkedin: formData.linkedin.value
        }

        UpdateUserInfo(auth.token, requestData)
            .then(response => {
                //show successful update message
            })
            .catch(({response: {data}}) => {
                setErrors(data)
            })
    }

    function handlePasswordSubmit(evt) {
        evt.preventDefault()

        const formData = evt.target;
        const new_password = formData.new_password.value
        const old_password = formData.old_password.value
        const password_repeat = formData.new_password_check.value

        if (new_password != password_repeat) {
            console.log(password_repeat)//show an error prompt
        }


        UpdatePassword(auth.token, {
            new_password: new_password,
            old_password: old_password
        })
            .then(response => {
                //show success message
            })
            .catch(err => {
                //show error
                //reason is transmitted alonside response
            })
    }

    const [image, setImage] = useState()
    function handlePictureSubmit(evt) {
        evt.preventDefault()

        console.log(image)
        let formData = new FormData()
        formData.append("picture", image)

        UploadPicture(auth.token, formData)
            .then(response => {
                setUser({
                    ...user,
                    ...response
                })
            })
            .catch(({response: {data}}) => {
                setErrors(data)
            })
    }

    //TODO: make the update button active when default data is changed
    //TODO: set maximum file size for picture

    return (
        <div className="flex flex-col w-full min-h-screen bg-muted/40">
            <Header user={user}></Header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto">
                    <StickyPageNavigation title="Settings">
                        <a href="#profile" >
                            Profile
                        </a>
                        <a href="#picture">
                            Picture
                        </a>
                        <a href="#password">
                            Password
                        </a>
                    </StickyPageNavigation>
                    <div className="grid gap-6">
                        <Card id="profile">
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <NonBlankInput id="username" defaultValue={user.username} {...errs("username")} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <NonBlankInput id="email" type="email" defaultValue={user.email} {...errs("email")}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="first_name" defaultValue={user.first_name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="last_name" defaultValue={user.last_name} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Github Profile</Label>
                                        <Input id="github" defaultValue={user.github} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Linkedin</Label>
                                        <Input id="linkedin" defaultValue={user.linkedin} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Button size="sm">Update</Button>
                                    </div>
                                </CardContent>
                            </form>
                        </Card>
                        <Card id="picture">
                            <CardHeader>
                                <CardTitle>Edit Picture</CardTitle>
                            </CardHeader>
                            <form method="post" type="multipart" onSubmit={handlePictureSubmit}>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label>Current</Label>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={user.picture} />
                                                <AvatarFallback>{initials}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Select a new picture</Label>
                                        <div className="flex items-center gap-4">
                                            <ErrorInput type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} {...errs("picture")} />
                                            <Button type="submit">Upload</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </form>
                        </Card>
                        <Card id="password">
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                            </CardHeader>
                            <form onSubmit={handlePasswordSubmit}>
                                <CardContent className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="old_password">Old password</Label>
                                        <NonBlankInput id="old_password" name="old_password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new_password">New password</Label>
                                        <NonBlankInput id="new_password" name="new_password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new_password_check">Repeat new password</Label>
                                        <NonBlankInput id="new_password_check" name="new_password_check" type="password" />
                                    </div>
                                </CardContent>
                                <CardContent className="grid gap-6">
                                    <Button type="submit" variant="destructive">Change password</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
