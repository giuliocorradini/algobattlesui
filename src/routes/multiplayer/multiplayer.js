import { useContext, useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthenticationContext, CurrentUserContext } from "../../lib/api";
import { Toaster } from "../../components/ui/toaster";
import { useToast } from "../../components/ui/use-toast";
import { Button } from "@radix-ui/themes";

function Member({id, username, first_name, last_name, deactivate, sendRequest}) {
    return <div>
        {username}, with ID {id}. {first_name} {last_name}
        {deactivate ? <></> : <button onClick={() => {sendRequest(id)}}>Send request</button>}
    </div>
}

export default function MultiplayerPage() {
    const { isLogged, token } = useContext(AuthenticationContext)
    const { user } = useContext(CurrentUserContext)
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://localhost:8000/ws/multiplayer?token=${token}`);
    const [members, setMembers] = useState([])
    const { toast } = useToast()
    const [ challenge, setChallenge ] = useState({})    //sets the current challenge when a user accepts
    const [ enteredLobby, setEnteredLobby ] = useState(false)

    function sendChallengeRequest(rival_id) {
        sendJsonMessage({
            challenge: {
                to: rival_id
            }
        })
    }

    function acceptChallenge(id) {
        sendJsonMessage({
            "accept": {
                "challenge": {
                    "id": id
                }
            }
        })
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
                description: `User ${challenge.from} has sent you a challenge`,
                action: <Button onClick={() => {acceptChallenge(challenge.id)}}>Accept</Button>
            })
        }

        if ("accept" in lastJsonMessage) {
            toast({
                title: "Challenge accepted",
                description: "User has accepted your challenge"
            })
        }

        if ("decline" in lastJsonMessage) {
            toast({
                title: "Challenge declined",
                description: "User has declined your challenge"
            })
        }
    }

    useEffect(decodeLastJsonEffect, [lastJsonMessage])
    useEffect(() => {
        if (readyState == ReadyState.OPEN && !enteredLobby) {
            sendJsonMessage({"enter": "lobby"})
            setEnteredLobby(false)
        }
    }, [readyState])

    return <div>
        Multiplayer

        <p>Last message: {lastJsonMessage ? lastJsonMessage.message : ""}</p>

        <button onClick={() => {sendJsonMessage({
            message: "west end girls"
        })}}>Send message</button>

        <p>Lista utenti</p>
        {
            members.map((m, i) => <Member key={i} {...m} sendRequest={sendChallengeRequest} deactivate={user.username==m.username} />)
        }

        <Toaster />
    </div>
}