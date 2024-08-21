import { useContext } from "react";
import useWebSocket from "react-use-websocket";
import { AuthenticationContext } from "../../lib/api";

export default function MultiplayerPage() {
    const { isLogged, token } = useContext(AuthenticationContext)
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://localhost:8000/ws/multiplayer?token=${token}`);

    return <div>
        Multiplayer

        <p>Last message: {lastJsonMessage ? lastJsonMessage.message : ""}</p>

        <button onClick={() => {sendJsonMessage({
            message: "west end girls"
        })}}>Send message</button>
    </div>
}