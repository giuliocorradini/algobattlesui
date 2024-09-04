import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { ChevronRightIcon, BookmarkIcon, PuzzleIcon, UserRound, UserRoundPen, NetworkIcon, Plus, Pen } from "lucide-react"
import { AuthenticationContext, CurrentUserContext, } from "../../lib/api"
import { useContext, useEffect, useState } from "react"
import { FetchUserInfo } from "../../lib/api/user"
import { Toaster } from "../../components/ui/toaster"
import { FetchFeaturedProblems } from "../../lib/api/home"
import { SearchResults } from "../../components/search"
import PuzzleCollection from "../../components/puzzlecollection"
import Header from "./header"

function LoggedInActions() {
  const navigate = useNavigate()
  //TODO: recently played
  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left">
      <BookmarkIcon className="h-4 w-4" />
      <span>Recently played</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => { navigate("/multiplayer") }} >
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

function PublisherActions() {
  const navigate = useNavigate();

  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => navigate("/publisher?add")}>
      <Plus className="h-4 w-4" />
      <span>Add</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => navigate("/publisher")}>
      <Pen className="h-4 w-4" />
      <span>Manage</span>
    </Button>
  </>
}

function Actions({ isLogged, isPublisher }) {
  if (!isLogged)
    return <></>

  return <div>
    <div className="mt-4 px-2 text-xl font-medium text-muted-foreground">Quick actions</div>
    {isPublisher ?
      <PublisherActions></PublisherActions> :
      <LoggedInActions></LoggedInActions>
    }
  </div>
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

function HighlightedCategories({ categories }) {
  return categories.map((cat, i) => {
    return <CategoryElement {...cat} key={i}></CategoryElement>
  })
}

function JumboSection({isLogged, user}) {
  return (
    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: "url('/static/homepage_jumbo.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold">Welcome {isLogged ? user.username : ""} to Algobattles!</h1>
        <p className="mt-2 text-lg">Solve coding puzzles, and battle your friends.</p>
        {
          isLogged ? "Select a puzzle or use the search bar..." :
            <Link to="/login">
              <Button variant="primary" className="mt-4">Login</Button>
            </Link>
        }
      </div>
    </div>
  );
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
  const [searchResults, setSearchResults] = useState(null)

  const navigate = useNavigate()
  const openProblem = (pk) => navigate(`editor/${pk}`)

  useEffect(() => {
    if (isLogged)
      FetchUserInfo(token).then((response) => {
        if (response.status === 200)
          setUser(response.data)
      }).catch(err => { })

    FetchFeaturedProblems()
      .then(({ data }) => {
        setFeaturedProblems(data)
      })
      .catch(err => { })
  }, [isLogged])

  return <div className="flex flex-col h-screen">
    <Header user={user} setResults={setSearchResults} />

    <JumboSection isLogged={isLogged} user={user}></JumboSection>
    <main className="mx-8">

      
      <Actions isLogged={isLogged} isPublisher={user.is_publisher}></Actions>
      {
        searchResults != null && <SearchResults results={searchResults} openProblem={openProblem} />
      }

      <div className="mb-4">
      <div className="mt-4 px-2 text-xl font-medium text-muted-foreground">Featured categories</div>
      <div className="px-2 mb-2 text-s font-medium text-muted-foreground">A curated list of puzzles from the most popular categories</div>
        {
          featuredProblems.map((c, i) => <PuzzleCollection
            collectionName={c.name} key={i}
            content={c.puzzles}
          >
          </PuzzleCollection>)
        }
      </div>
    </main>

    <Toaster></Toaster>
  </div>
}
