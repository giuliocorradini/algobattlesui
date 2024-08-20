import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet"
import { Input } from "../components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { SwordsIcon, ChevronRightIcon, BookmarkIcon, PuzzleIcon, MenuIcon, CircleUserIcon, UserIcon, UserRound, UserRoundPen, NetworkIcon } from "lucide-react"
import { AuthenticationContext, CurrentUserContext, invalidateLocalStorageToken, logoutRequest, } from "../lib/api"
import { useContext, useEffect, useState } from "react"
import { FetchUserInfo } from "../lib/api/user"
import { HomeButton } from "../components/homebutton"
import { AccountButton } from "../components/accountbutton"
import { Toaster } from "../components/ui/toaster"
import { FetchFeaturedProblems } from "../lib/api/home"

function LoggedInActions() {
  const navigate = useNavigate()

  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left">
      <BookmarkIcon className="h-4 w-4" />
      <span>Saved</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left">
      <PuzzleIcon className="h-4 w-4" />
      <span>Discover</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => {navigate("/multiplayer")}} >
      <NetworkIcon className="h-4 w-4" />
      <span>Multiplayer</span>
    </Button>
  </>
}

function AnonymousActions() {
  const navigate = useNavigate();

  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => navigate("/login")}>
      <UserRound className="h-4 w-4" />
      <span>Login</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => navigate("/register")}>
      <UserRoundPen className="h-4 w-4" />
      <span>Register</span>
    </Button>
  </>
}

function Actions({ isLogged }) {
  if (isLogged)
    return [
    <div className="mt-4 px-2 text-xs font-medium text-muted-foreground">Actions</div>,
    <LoggedInActions></LoggedInActions>
  ]
  else
    return <></>
}

function CategoryElement({ name, link }) {
  return <>
    <Link
      href={link}
      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
    >
      <span>{name}</span>
      <ChevronRightIcon className="h-4 w-4" />
    </Link>
  </>
}

function HighlightedCategories({categories}) {
  return categories.map((cat, i) => {
    return <CategoryElement {...cat} key={i}></CategoryElement>
  })
}

function PuzzleCollectionCard({ title, difficulty, categories, id: pk }) {
  return <Card className="w-[200px] shrink-0">
    <CardContent className="flex aspect-[3/4] items-center justify-center rounded-md bg-background p-4">
      <img
        src="/placeholder.svg"
        alt="Puzzle"
        className="aspect-[3/4] w-full rounded-md object-cover"
        width="200"
        height="300"
      />
    </CardContent>
    <CardFooter>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{difficulty}</div>
    </CardFooter>
    <Link to={`editor/${pk}`} >Open</Link>
  </Card>
}

function PuzzleCollection({ collectionName, content }) {
  return <section>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{collectionName}</h2>
      <Link href="#" className="text-sm font-medium text-primary hover:underline">
        View all
      </Link>
    </div>
    <div className="mt-4 flex gap-4 overflow-auto">

      {content.map((p, i) => {
        return <PuzzleCollectionCard key={i} {...p}></PuzzleCollectionCard>
      })}

    </div>
  </section>
}

export default function HomePage() {
  const highlight_categories = [
    { name: "Greedy", link: "greedy" },
    { name: "Divide and conquer", link: "dac" },
    { name: "Tree", link: "tree" },
    { name: "Computational geometry", link: "geom" }
  ]

  const { isLogged, token, ...auth } = useContext(AuthenticationContext)
  const { user, setUser } = useContext(CurrentUserContext)

  const [featuredProblems, setFeaturedProblems] = useState([])

  useEffect(() => {
    if(isLogged)
      FetchUserInfo(token).then((response) => {
        if (response.status === 200)
          setUser(response.data)
      }).catch(err => {})

    FetchFeaturedProblems()
    .then(({data}) => {
      setFeaturedProblems(data)
    })
    .catch(err => {})
  }, [isLogged])

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 border-r bg-background md:flex flex-col">
        <div className="sticky top-0 flex h-14 items-center justify-between border-b px-4">
          <HomeButton />
        </div>
        <nav className="flex flex-1 flex-col space-y-1 overflow-auto p-4">
          <div className="px-2 text-xs font-medium text-muted-foreground">Categories</div>

          <HighlightedCategories categories={highlight_categories}></HighlightedCategories>

          <Actions isLogged={isLogged}></Actions>
        </nav>
      </aside>

      

      <div className="flex-1 bg-muted/40">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">

          <div className="flex items-center gap-4">
          <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="md:hidden">
                <nav className="grid gap-1 px-2 py-4">
                <HighlightedCategories categories={highlight_categories}></HighlightedCategories>

                  <div className="mt-4 px-2 text-xs font-medium text-muted-foreground">Actions</div>
                  
                  <Actions isLogged={isLogged}></Actions>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search puzzles..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>

         
        </header>

        <main className="grid gap-4 p-4 md:p-6">

          <PuzzleCollection
          collectionName="Debug"
          content={[
            {title: "Puzzle 2", difficulty: "Medium", id: 2, categories: ["greedy"]}
          ]}
          ></PuzzleCollection>

          {
            featuredProblems.map((c, i) => <PuzzleCollection
              collectionName={c.name} key={i}
              content={c.puzzles}
            >
            </PuzzleCollection>)
          }

        </main>
        <Toaster></Toaster>
      </div>
    </div>
  )
}
