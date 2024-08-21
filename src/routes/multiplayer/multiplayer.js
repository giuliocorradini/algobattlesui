import { useContext, useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { AuthenticationContext, CurrentUserContext } from "../../lib/api";
import { Toaster } from "../../components/ui/toaster";
import { useToast } from "../../components/ui/use-toast";

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

    function sendChallengeRequest(rival_id) {
        sendJsonMessage({
            challenge: {
                to: rival_id
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
                description: `User ${challenge.from} has sent you a challenge`
            })
        }
    }

    useEffect(decodeLastJsonEffect, [lastJsonMessage])

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