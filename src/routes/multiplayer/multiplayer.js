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
import { UserCard } from "./user";

function Member({id, username, first_name, last_name, deactivate, sendRequest}) {
    return <div>
        {username}, with ID {id}. {first_name} {last_name}
        {deactivate ? <></> : <button onClick={() => {sendRequest(id)}}>Send request</button>}
    </div>

}

function UserList({members, sendChallengeRequest, user}) {
    return <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Active users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {
                members.filter(m => m.username != user.username).map((m, i) => <UserCard key={i} user={{ ...m }} sendRequest={() => sendChallengeRequest(m.id)} />)
            }

        </div>
    </div>
}

function PuzzleSelection({selectedProblem, setSelectedProblem, role, sendProblem}) {
    if (role == "starter")
        return [<p>Seleziona puzzle</p>,
            <input type="number" value={selectedProblem} onChange={setSelectedProblem}></input>,
            <button onClick={() => {sendProblem()}}>Set problem</button>]
    return <></>
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
        if (isLogged)
            connectWs()
        else
            navigate("/login")
    }, [])

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
            const {challenge} = lastJsonMessage
            toast({
                title: "Challenge",
                description: `User ${challenge.from.username} has sent you a challenge`,
                action: <Button onClick={() => {acceptChallenge(challenge.id, challenge.from)}}>Accept</Button>
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
    }

    useEffect(decodeLastJsonEffect, [lastJsonMessage])
    useEffect(() => {
        if (readyState == ReadyState.OPEN && !enteredLobby) {
            authenticate(token)
            sendJsonMessage({"enter": "lobby"})
            setEnteredLobby(false)
        }
    }, [readyState])

    const [selectedProblem, setSelectedProblem] = useState(0)
    function sendProblem() {
        sendJsonMessage({
            "puzzle": {
                "set": {
                    "id": selectedProblem
                }
            }
        })

        navigate(`/multiplayer/editor/${selectedProblem}`)
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

        <UserList {...{user, sendChallengeRequest, members}}></UserList>

        <PuzzleSelection selectedProblem={selectedProblem} setSelectedProblem={evt => {setSelectedProblem(evt.target.value)}} role={role} sendProblem={sendProblem}></PuzzleSelection>
        <p>Selected puzzle: {selectedProblem}</p>
        <Toaster />
    </div>
}