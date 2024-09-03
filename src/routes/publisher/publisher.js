import React from "react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Switch } from "../../components/ui/switch"
import { Form, Link, useNavigate, useSearchParams } from "react-router-dom"
import { SwordsIcon } from "lucide-react"
import { AccountButton } from "../../components/accountbutton"
import { useContext, useEffect, useState } from "react"
import { AuthenticationContext, CurrentUserContext, invalidateLocalStorageToken } from "../../lib/api"
import { UpdatePassword, UpdateUserInfo, UploadPicture } from "../../lib/api/user"
import { ErrorInput, NonBlankInput } from "../../components/errorfield"
import { useToast } from "../../components/ui/use-toast"
import { Toaster } from "../../components/ui/toaster"
import NewProblemButton from "./newProblemButton"
import PaginatedPuzzleTable from "../../components/paginatedPuzzleTable"
import { SearchBar, SearchResults } from "../../components/search"
import { SearchPublishedPuzzles } from "../../lib/api/publisher"
import PublishedPuzzleTable from "./publishedPuzzles"

function Header({user}) {
    return <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
            <SwordsIcon className="h-6 w-6" />
            AlgoBattles
        </Link>
        <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
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

    return <div className="md:sticky top-16">
        <nav className="text-sm text-muted-foreground grid gap-4">
            <div className="max-w-6xl w-full mx-auto text-primary">
                <h1 className="font-semibold text-3xl">{title}</h1>
            </div>
            {children ? children.map(
                (child, i) => {return React.cloneElement(child, {onClick: () => setActive(i), key: i, className: activeCn(i)})}
            ) : <></>}
        </nav>
    </div>
}

export default function PublisherPage() {
    const auth = useContext(AuthenticationContext)
    const {user, setUser} = useContext(CurrentUserContext)
    const navigate = useNavigate()
    const {toast} = useToast()
    const [actionParam, setActionParam] = useSearchParams()

    useEffect(() => {
        if (!auth.isLogged)
            navigate("/login")

        if (!user.is_publisher)
            navigate("/")
    }, [])

    // Form validation
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
                toast({
                    title: "Successful update",
                    description: "Your user information was updated successfully."
                })

                setUser(response.data)
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
            setErrors({
                new_password_check: "New password and password check do not match."
            })
            return
        }

        UpdatePassword(auth.token, {
            new_password: new_password,
            old_password: old_password
        })
            .then(response => {
                invalidateLocalStorageToken()
                auth.setAuthentication([false, null])
                setUser({})
                
                navigate("/")
                toast({
                    title: "Password",
                    description: "Your password has been successfully changed. Your session has been invalidated and you have been disconnected. Please log back in."
                })  // Pops up in homepage toaster
            })
            .catch(({response: {data}}) => {
                setErrors(data)
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
                toast({
                    title: "Successful update",
                    description: "Your user picture was updated successfully."
                })

                setUser({
                    ...user,
                    ...response.data
                })
            })
            .catch(({response: {data}}) => {
                setErrors(data)
            })
    }

    const [searchResults, setSearchResults] = useState(null)

    return (
        <div className="flex flex-col w-full min-h-screen bg-muted/40">
            <Header user={user}></Header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto">
                    <StickyPageNavigation title="Puzzle editor">
                    </StickyPageNavigation>
                    <div className="grid gap-6">

                        <Card id="published">
                            <CardHeader>
                                <CardTitle>Published problems</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <SearchBar setResults={setSearchResults} searchCallback={(query) => SearchPublishedPuzzles(auth.token, 1, query)}></SearchBar>
                                {
                                    searchResults ?
                                    <SearchResults results={searchResults}/> :
                                    <PublishedPuzzleTable token={auth.token}></PublishedPuzzleTable>
                                }
                            </CardContent>
                        </Card>

                        

                    </div>
                </div>
            </main>

            <Toaster></Toaster>
            <NewProblemButton onClick={() => {}}/>
        </div>
    )
}
