import { useContext, useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { AuthenticationContext } from "../../lib/api";

function Member({id, username, first_name, last_name}) {
    return <div>
        {username}, with ID {id}. {first_name} {last_name}
    </div>
}

export default function MultiplayerPage() {
    const { isLogged, token } = useContext(AuthenticationContext)
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://localhost:8000/ws/multiplayer?token=${token}`);
    const [members, setMembers] = useState([])
    
    function decodeLastJsonEffect() {
        if (!lastJsonMessage)
            return
        
        if ("members" in lastJsonMessage) {
            setMembers(lastJsonMessage.members)
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
            members.map((m, i) => <Member key={i} {...m}/>)
        }
    </div>
}