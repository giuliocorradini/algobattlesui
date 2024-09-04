import { useContext, useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthenticationContext, CurrentUserContext } from "../../lib/api";
import { Toaster } from "../../components/ui/toaster";
import { useToast } from "../../components/ui/use-toast";
import { Button } from "@radix-ui/themes";
import { useMultiplayerWebsocket } from "./websocket";
import { useNavigate } from "react-router-dom";
import { useChallenge } from "./challengecontext";
import { HomeButton } from "../../components/homebutton";
import { AccountButton } from "../../components/accountbutton";
import { UserCard, UserCardWithButton } from "./user";
import UserInfoDialog from "./userinfodialog";
import { FetchUserPublicInfo } from "../../lib/api/user";
import LoadingCard from "./loadingcard";
import { SearchBar, SearchResults } from "../../components/search";
import FeaturedProblems from "../../components/featuredproblems";
import { Loader } from "lucide-react";

function UserList({members, showUserDetail, user}) {
    return <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row space-x-4">
            <h2 className="text-xl font-bold mb-4">Active users</h2>
            <Loader className="animate-spin" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {
                members.filter(m => m.username != user.username).map((m, i) => <UserCard key={i} user={{ ...m }} clickAction={() => showUserDetail(m.id)} />)
            }

        </div>
    </div>
}

/**
 * Horizontally scrollable (TODO) list of received requests for challenge. Shows the other user
 */
function ChallengeRequestsList({requests, acceptChallenge}) {
    return requests.length > 0 &&
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-4">Challenge requests</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {
                    requests.map((chal, i) => <UserCardWithButton key={i} user={chal.sender} acceptChallenge={() => acceptChallenge(chal.id, chal.sender)}/>)
                }

            </div>
        </div>
}

function PuzzleSelection({role, sendProblem}) {
    const [searchResults, setSearchResults] = useState(null)

    if (role == "starter")
        return <div className="container mx-auto px-4 py-4">
            <h2 className="text-xl font-bold">Select a puzzle</h2>
            <div className="py-5">
                <SearchBar setResults={setSearchResults} className="mb-5" />
                {searchResults == null ? <></> :
                <SearchResults results={searchResults} openProblem={sendProblem} />}
            </div>
            <h2 className="text-xl font-bold mb-4">Or pick one from the featured</h2>
            <div>
                <FeaturedProblems openProblem={sendProblem} />
            </div>
        </div>

    return <LoadingCard />
}


export default function MultiplayerPage() {
    const { isLogged, token } = useContext(AuthenticationContext)
    const { user } = useContext(CurrentUserContext)
    const { sendJsonMessage, lastJsonMessage, readyState, connectWs, authenticate } = useMultiplayerWebsocket()
    const [members, setMembers] = useState([])
    const { toast } = useToast()
    const { challenge, setChallenge, setOpponent } = useChallenge()
    const [ enteredLobby, setEnteredLobby ] = useState(false)
    const [ role, setRole ] = useState("opponent")
    const nav = useNavigate()
    const navigate = (to) => {
        //lobby logout
        nav(to)
    }

    // Setup
    useEffect(() => {
        if (user.is_publisher) {
            navigate("/")
            toast({
              title: "Unauthorized",
              description: "You can't attend multiplayer when using a publisher account",
              variant: "destructive"
            })
            return
        }
      

        if (isLogged)
            connectWs()
        else
            navigate("/login")
    }, [])


    const [challengeRequests, setChallengeRequests] = useState([])

    /* User information dialog state */
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [watchingUserId, setWatchingUserId] = useState(0)
    const [currentWatchingUser, setCurrentWatchingUser] = useState({})

    useEffect(() => {
        if (watchingUserId == 0)
            return

        FetchUserPublicInfo(token, watchingUserId)
        .then(({data}) => {
            setCurrentWatchingUser(data)
        })
        .catch(err => {
            setDialogOpen(false)
            toast({
                description: "Error retrieving user info. Check connection"
            })
        })
    }, [watchingUserId])


    function sendChallengeRequest(rival_id) {
        sendJsonMessage({
            challenge: {
                to: rival_id
            }
        })
    }

    function acceptChallenge(id, from) {
        sendJsonMessage({
            "accept": {
                "challenge": {
                    "id": id
                }
            }
        })

        setChallenge(id)
        setOpponent(from)
    }

    function decodeLastJsonEffect() {
        if (!lastJsonMessage)
            return

        if ("members" in lastJsonMessage) {
            setMembers(lastJsonMessage.members)
        }

        if ("challenge" in lastJsonMessage) {
            const {challenge: {last, all}} = lastJsonMessage
            setChallengeRequests(all)

            if (last)
                toast({
                    title: "Challenge",
                    description: `User ${last.from.username} has sent you a challenge`,
                    action: <Button onClick={() => {acceptChallenge(last.id, last.from)}}>Accept</Button>
                })
        }

        if ("accept" in lastJsonMessage) {
            toast({
                title: "Challenge accepted",
                description: "User has accepted your challenge"
            })

            const {accept: {challenge, opponent}} = lastJsonMessage

            setChallenge(challenge.id)
            setOpponent(opponent)
            setRole("starter")
        }

        if ("decline" in lastJsonMessage) {
            toast({
                title: "Challenge declined",
                description: "User has declined your challenge"
            })
        }

        if ("puzzle" in lastJsonMessage) {
            setSelectedProblem(lastJsonMessage.puzzle.id)
            navigate(`/multiplayer/editor/${lastJsonMessage.puzzle.id}`)
        }

        if ("error" in lastJsonMessage) {
            toast({
                title: "Error",
                description: lastJsonMessage.error,
                variant: "destructive"
            })
        }

        if ("restore" in lastJsonMessage) {
            const {challenge, opponent, puzzle} = lastJsonMessage.restore
            setChallenge(challenge.id)
            setOpponent(opponent)
            setSelectedProblem(puzzle.id)
            navigate(`/multiplayer/editor/${puzzle.id}`)
        }
    }

    useEffect(decodeLastJsonEffect, [lastJsonMessage])
    useEffect(() => {
        if (readyState == ReadyState.OPEN && !enteredLobby) {
            authenticate(token)
            sendJsonMessage({"enter": "lobby"})
            setEnteredLobby(true)
        }
    }, [readyState])

    useEffect(() => {
        setChallenge(0)
    }, [])

    const [selectedProblem, setSelectedProblem] = useState(0)
    function sendProblem(pk) {
        setSelectedProblem(pk)
        sendJsonMessage({
            "puzzle": {
                "set": {
                    "id": pk
                }
            }
        })

        navigate(`/multiplayer/editor/${pk}`)
    }

    return <div className="flex flex-col h-screen">
        <header className="bg-background border-b flex items-center justify-between px-4 py-2 shadow-sm">
            <div className="flex items-center gap-4">
                <HomeButton />
                Multiplayer lobby
            </div>
            <div className="flex items-center gap-4">
                <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
            </div>
        </header>

        {
            challenge == 0 ? <>
                <ChallengeRequestsList
                requests={challengeRequests}
                acceptChallenge={acceptChallenge} />
                <UserList {...{user, members}} showUserDetail={(opponentId) => {
                    setWatchingUserId(opponentId)
                    setDialogOpen(true)
                }} /> 
            </>:
                <PuzzleSelection role={role} sendProblem={sendProblem}></PuzzleSelection>
        }

        <UserInfoDialog open={isDialogOpen} onOpenChange={setDialogOpen} user={currentWatchingUser} handleSendChallenge={() => {sendChallengeRequest(watchingUserId)}}></UserInfoDialog>
        <Toaster />
    </div>
}