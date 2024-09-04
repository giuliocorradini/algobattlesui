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
import { EditPuzzle, PublisherDetailPuzzle, PublishPuzzle, SearchPublishedPuzzles } from "../../lib/api/publisher"
import PublishedPuzzleTable from "./publishedPuzzles"
import PuzzleDialog, { CreatePuzzleDialog, EditPuzzleDialog } from "./puzzleDialog"

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

        if (actionParam.has("add")) {
            setOpenCreationDialog(true)
            setActionParam({})
        }
    }, [])

    // Form validation
    const [errors, setErrors] = useState({})
    const hasErrors = (field) => field in errors
    const errorFor = (field) => errors[field]
    const errs = (field) => {return {
        error: hasErrors(field),
        errorLabel: errorFor(field)
    }}

    const [openCreationDialog, setOpenCreationDialog] = useState(false)
    const [forceUpdate, setForceUpdate] = useState(false)

    function handleCreationSubmit(evt) {
        evt.preventDefault()

        const formData = evt.target;
        const requestData = {
            title: formData.title.value,
            difficulty: formData.difficulty.value,
            description: formData.description.value,
            time_constraint: parseInt(formData.timeConstraint.value, 10),
            memory_constraint: parseInt(formData.memoryConstraint.value, 10),
            visibility: formData.visibility.value,
            categories: formData.categories.value.split(',').map(cat => cat.trim()).filter(cat => cat !== '')
        };

        
        PublishPuzzle(auth.token, requestData)
            .then(response => {
                toast({
                    title: "Created",
                    description: `The puzzle was created. ID: ${response.data.id}.`
                })

                setOpenCreationDialog(false)
                setErrors({})
                setForceUpdate(true)
            })
            .catch(({response: {data}}) => {
                setErrors(data)
            })
    }

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [currentPuzzle, setCurrentPuzzle] = useState({})

    function FetchPuzzleAndOpen(pk) {
        PublisherDetailPuzzle(auth.token, pk)
        .then(response => {
            setCurrentPuzzle(response.data)
            setOpenEditDialog(true)
        })
        .catch(err => {})
    }

    function handleEditSubmit(evt) {
        evt.preventDefault()

        const formData = evt.target;
        const requestData = {
            title: formData.title.value,
            difficulty: formData.difficulty.value,
            description: formData.description.value,
            time_constraint: parseInt(formData.timeConstraint.value, 10),
            memory_constraint: parseInt(formData.memoryConstraint.value, 10),
            visibility: formData.visibility.value,
            categories: formData.categories.value.split(',').map(cat => cat.trim()).filter(cat => cat !== '')
        };

        
        EditPuzzle(auth.token, currentPuzzle.id, requestData)
            .then(response => {
                toast({
                    title: "Edited",
                    description: `The puzzle with ID ${response.data.id} was correctly edited.`
                })

                setOpenEditDialog(false)
                setErrors({})
                setForceUpdate(true)
            })
            .catch(({response: {data}}) => {
                setErrors(data)
            })
    }

    const [searchResults, setSearchResults] = useState(null)
    const [query, setQuery] = useState("")

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
                                <SearchBar setResults={setSearchResults} searchCallback={(q) => {
                                    setQuery(q)
                                    return SearchPublishedPuzzles(auth.token, 1, q)
                                }}></SearchBar>

                                {
                                    searchResults != undefined ?
                                    <PaginatedPuzzleTable puzzles={searchResults} setPuzzles={setSearchResults} fetchPuzzles={(page) => SearchPublishedPuzzles(auth.token, page, query)} openCallback={FetchPuzzleAndOpen}/> :
                                    <PublishedPuzzleTable token={auth.token} openCallback={FetchPuzzleAndOpen} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate}></PublishedPuzzleTable>
                                }

                            </CardContent>
                        </Card>

                        

                    </div>
                </div>
            </main>

            <Toaster></Toaster>
            <CreatePuzzleDialog errs={errs} handleSubmit={handleCreationSubmit} open={openCreationDialog} setOpen={setOpenCreationDialog} />
            <EditPuzzleDialog errs={errs} handleSubmit={handleEditSubmit} open={openEditDialog} setOpen={setOpenEditDialog} values={currentPuzzle} />
        </div>
    )
}
