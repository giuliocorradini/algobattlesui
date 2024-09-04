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
import Header, { HeaderNoSearch } from "./header"
import { FetchRecentlyPlayed } from "../../lib/api/puzzle"
import { PuzzleSortableTable } from "./table"

function LoggedInActions() {
  const navigate = useNavigate()
  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" disabled>
      <BookmarkIcon className="h-4 w-4" />
      <span>Recently played</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left" onClick={() => { navigate("/multiplayer") }} >
      <NetworkIcon className="h-4 w-4" />
      <span>Multiplayer</span>
    </Button>
  </>
}

function Actions({ isLogged, isPublisher }) {
  if (!isLogged)
    return <></>

  return <div>
    <div className="mt-4 px-2 text-xl font-medium text-muted-foreground">Quick actions</div>
    <LoggedInActions />
  </div>
}

function JumboSection() {
  return (
    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: "url('/static/homepage_jumbo.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold">Recently played</h1>
        <p className="mt-2 text-lg">The puzzles you recently attempted or completed.</p>
      </div>
    </div>
  );
}

export default function RecentlyPlayedPage() {
  const { isLogged, token, ...auth } = useContext(AuthenticationContext)
  const { user } = useContext(CurrentUserContext)

  const [recentlyPlayed, setRecentlyPlayed] = useState([])

  const navigate = useNavigate()
  const openProblem = (pk) => navigate(`/editor/${pk}`)

  useEffect(() => {
    if (!isLogged)
      navigate("/login")

    FetchRecentlyPlayed(token)
    .then((response) => {
      setRecentlyPlayed(response.data.results)
    })
    .catch(err => {})
  }, [isLogged])

  return <div className="flex flex-col h-screen">
    <HeaderNoSearch user={user} />

    <JumboSection isLogged={isLogged} user={user}></JumboSection>
    <main className="mx-8">

      <Actions isLogged={isLogged} isPublisher={user.is_publisher}></Actions>

      <div className="mb-8">
        {
          recentlyPlayed != null && recentlyPlayed != undefined &&
          <PuzzleSortableTable results={recentlyPlayed} openProblem={openProblem} title={"Recently played"} />
        }
      </div>

    </main>

    <Toaster></Toaster>
  </div>
}
